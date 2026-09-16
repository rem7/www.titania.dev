(()=>{
    const root=document.getElementById('titania-crater');
    const group=root.querySelector('.fractures');
    const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
    let seed=713;
    const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
    const tau=Math.PI*2;
    const count=48;
    const innerRadius=49.92;
    const points=[];
    const paths=[];
    const f=n=>n.toFixed(2);
    const xy=p=>`${f(p[0])} ${f(p[1])}`;
    const lerp=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
    function add(vertices,delay,duration,opacity=1){
      const el=document.createElementNS('http://www.w3.org/2000/svg','path');
      el.setAttribute('d',vertices.map((p,i)=>(i?'L':'M')+xy(p)).join(' '));
      el.setAttribute('opacity',opacity);
      group.appendChild(el);
      paths.push({el,delay:delay/1.1,duration:duration/1.1});
    }
    for(let i=0;i<count;i++){
      const angle=tau*(i+(rand()-.5)*.32)/count;
      const profile=9*Math.sin(angle*3+.8)+6*Math.cos(angle*5-1);
      const radial=[innerRadius,136,170,205];
      const row=radial.map((r,j)=>{
        const theta=j===0?angle:angle+(rand()-.5)*(.045+j*.014);
        const radius=j===0?innerRadius:r+profile+(rand()-.5)*23;
        const scaleX=j===0?1:1.04;
        const scaleY=j===0?1:1.07;
        return [280+Math.cos(theta)*radius*scaleX,280+Math.sin(theta)*radius*scaleY];
      });
      points.push(row);
      const vertices=[row[0]];
      for(let j=1;j<row.length;j++){
        const mid=lerp(row[j-1],row[j],.4+rand()*.2);
        mid[0]+=(rand()-.5)*9;mid[1]+=(rand()-.5)*9;
        vertices.push(mid,row[j]);
      }
      add(vertices,rand()*900,5800+rand()*1500,.78+rand()*.22);
    }
    for(let i=0;i<count;i++){
      const next=(i+1)%count;
      for(let j=1;j<4;j++){
        if(rand()<(j===3?.39:.16))continue;
        const a=points[i][j],b=points[next][j];
        const mid=lerp(a,b,.35+rand()*.3);
        mid[0]+=(rand()-.5)*13;mid[1]+=(rand()-.5)*13;
        add([a,mid,b],1350+(j-1)*1800+rand()*800,1500+rand()*900,.73+rand()*.22);
      }
      if(i%3===1){
        const a=lerp(points[i][2],points[i][3],.48);
        const b=lerp(points[i][3],points[next][3],.52);
        const tip=[b[0]+(b[0]-280)*.07,b[1]+(b[1]-280)*.07];
        add([a,b,tip],4900+rand()*600,2300,.72);
      }
    }
    for(let i=0;i<count;i+=2){
      const next=(i+1)%count;
      const between=lerp(points[i][0],points[next][0],.5);
      const angle=Math.atan2(between[1]-280,between[0]-280);
      const start=[280+Math.cos(angle)*innerRadius,280+Math.sin(angle)*innerRadius];
      const middleRadius=innerRadius+13+rand()*5;
      const mid=[280+Math.cos(angle+.012)*middleRadius,280+Math.sin(angle+.012)*middleRadius];
      add([start,mid,points[next][1]],rand()*650,2100+rand()*550,.88);
    }
    function play(){
      paths.forEach(({el,delay,duration})=>{
        el.getAnimations().forEach(a=>a.cancel());
        if(reduce.matches)return;
        const length=el.getTotalLength();
        el.animate([
          {strokeDasharray:`${length} ${length}`,strokeDashoffset:length},
          {strokeDasharray:`${length} ${length}`,strokeDashoffset:0}
        ],{duration,delay,easing:'cubic-bezier(.25,.1,.3,1)',fill:'both'});
      });
    }
    reduce.addEventListener('change',()=>{if(reduce.matches)paths.forEach(({el})=>el.getAnimations().forEach(a=>a.cancel()));});
    if('IntersectionObserver' in window){
      const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){play();observer.disconnect();}},{threshold:.25});
      observer.observe(root);
    }else{play();}
  })();

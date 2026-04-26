import Icon from './Icon'

const f = "'DM Sans',sans-serif"

export const Btn = ({children,onClick,variant='primary',size='md',disabled,style,icon,type='button'}) => {
  const base = {display:'inline-flex',alignItems:'center',gap:8,border:'none',fontFamily:f,fontWeight:600,borderRadius:10,transition:'all .2s',opacity:disabled?.5:1,cursor:disabled?'not-allowed':'pointer'}
  const sz = {sm:{padding:'6px 14px',fontSize:13},md:{padding:'10px 20px',fontSize:14},lg:{padding:'14px 28px',fontSize:16}}
  const vr = {primary:{background:'#16a34a',color:'#fff'},secondary:{background:'#f0faf0',color:'#16a34a',border:'1px solid #bbdfbb'},danger:{background:'#fef2f2',color:'#dc2626',border:'1px solid #fca5a5'},ghost:{background:'transparent',color:'#4b5563'}}
  return <button type={type} onClick={onClick} disabled={disabled} style={{...base,...sz[size],...vr[variant],...style}}>{icon&&<Icon name={icon} size={size==='sm'?14:18}/>}{children}</button>
}

export const Input = ({label,error,style,...p}) => (
  <div style={{marginBottom:16,...style}}>
    {label&&<label style={{display:'block',fontSize:13,fontWeight:600,color:'#374151',marginBottom:6,fontFamily:f}}>{label}</label>}
    <input {...p} style={{width:'100%',padding:'10px 14px',borderRadius:10,border:error?'1.5px solid #dc2626':'1.5px solid #d1d5db',fontSize:14,fontFamily:f,outline:'none',boxSizing:'border-box',background:'#fafafa'}}/>
    {error&&<span style={{fontSize:12,color:'#dc2626',marginTop:4,display:'block'}}>{error}</span>}
  </div>
)

export const Textarea = ({label,...p}) => (
  <div style={{marginBottom:16}}>
    {label&&<label style={{display:'block',fontSize:13,fontWeight:600,color:'#374151',marginBottom:6,fontFamily:f}}>{label}</label>}
    <textarea {...p} style={{width:'100%',padding:'10px 14px',borderRadius:10,border:'1.5px solid #d1d5db',fontSize:14,fontFamily:f,resize:'vertical',minHeight:80,boxSizing:'border-box',background:'#fafafa',outline:'none'}}/>
  </div>
)

export const Select = ({label,options=[],...p}) => (
  <div style={{marginBottom:16}}>
    {label&&<label style={{display:'block',fontSize:13,fontWeight:600,color:'#374151',marginBottom:6,fontFamily:f}}>{label}</label>}
    <select {...p} style={{width:'100%',padding:'10px 14px',borderRadius:10,border:'1.5px solid #d1d5db',fontSize:14,fontFamily:f,outline:'none',background:'#fafafa',boxSizing:'border-box'}}>
      <option value="">Seleccionar...</option>
      {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
)

export const Card = ({children,style,onClick}) => (
  <div onClick={onClick} style={{background:'#fff',borderRadius:14,padding:24,boxShadow:'0 1px 3px rgba(0,0,0,.06)',border:'1px solid #e8ece8',cursor:onClick?'pointer':'default',...style}}>{children}</div>
)

export const Modal = ({open,onClose,title,children,width=480}) => {
  if(!open) return null
  return (
    <div style={{position:'fixed',inset:0,zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,.4)',backdropFilter:'blur(4px)'}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:'#fff',borderRadius:18,padding:28,width:'90%',maxWidth:width,maxHeight:'85vh',overflowY:'auto',boxShadow:'0 20px 60px rgba(0,0,0,.2)',animation:'scaleIn .25s ease'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
          <h3 style={{margin:0,fontSize:18,fontWeight:700,color:'#111'}}>{title}</h3>
          <button onClick={onClose} style={{background:'none',border:'none',padding:4}}><Icon name="x" size={20} color="#9ca3af"/></button>
        </div>
        {children}
      </div>
    </div>
  )
}

export const Badge = ({text,color='#16a34a'}) => (
  <span style={{display:'inline-block',padding:'3px 10px',borderRadius:20,fontSize:12,fontWeight:600,background:color+'18',color,fontFamily:f}}>{text}</span>
)

export const Table = ({columns,data=[],actions}) => (
  <div style={{overflowX:'auto',borderRadius:12,border:'1px solid #e8ece8'}}>
    <table style={{width:'100%',borderCollapse:'collapse',fontFamily:f,fontSize:14}}>
      <thead><tr style={{background:'#f0faf0'}}>
        {columns.map(c=><th key={c.key} style={{padding:'12px 16px',textAlign:'left',fontWeight:600,color:'#374151',borderBottom:'1px solid #e8ece8',whiteSpace:'nowrap'}}>{c.label}</th>)}
        {actions&&<th style={{padding:'12px 16px',textAlign:'right',fontWeight:600,color:'#374151',borderBottom:'1px solid #e8ece8'}}>Acciones</th>}
      </tr></thead>
      <tbody>
        {data.length===0&&<tr><td colSpan={columns.length+(actions?1:0)} style={{padding:40,textAlign:'center',color:'#9ca3af'}}>Sin datos</td></tr>}
        {data.map((row,i)=>(
          <tr key={row.id||i} style={{borderBottom:'1px solid #f3f4f6'}} onMouseEnter={e=>e.currentTarget.style.background='#f9fef9'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
            {columns.map(c=><td key={c.key} style={{padding:'12px 16px',color:'#4b5563'}}>{c.render?c.render(row[c.key],row):(row[c.key]??'—')}</td>)}
            {actions&&<td style={{padding:'12px 16px',textAlign:'right'}}>{actions(row)}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export const Pagination = ({page,totalPages,onChange}) => {
  if(totalPages<=1) return null
  return <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,marginTop:16}}>
    <Btn variant="ghost" size="sm" disabled={page===0} onClick={()=>onChange(page-1)} icon="chevL"/>
    <span style={{fontSize:14,color:'#6b7280',fontFamily:f}}>Página {page+1} de {totalPages}</span>
    <Btn variant="ghost" size="sm" disabled={page>=totalPages-1} onClick={()=>onChange(page+1)} icon="chevR"/>
  </div>
}

export const PageHeader = ({title,subtitle,action}) => (
  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:24,flexWrap:'wrap',gap:12}}>
    <div>
      <h2 style={{margin:0,fontSize:22,fontWeight:700,color:'#111'}}>{title}</h2>
      {subtitle&&<p style={{margin:'4px 0 0',fontSize:14,color:'#6b7280'}}>{subtitle}</p>}
    </div>
    {action}
  </div>
)

export const StatCard = ({label,value,icon,color='#16a34a'}) => (
  <Card style={{display:'flex',alignItems:'center',gap:16}}>
    <div style={{width:48,height:48,borderRadius:12,background:color+'14',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <Icon name={icon} size={24} color={color}/>
    </div>
    <div>
      <div style={{fontSize:24,fontWeight:700,color:'#111'}}>{value}</div>
      <div style={{fontSize:13,color:'#6b7280'}}>{label}</div>
    </div>
  </Card>
)

export const TabBar = ({tabs,active,onChange}) => (
  <div style={{display:'flex',gap:4,background:'#f0faf0',borderRadius:12,padding:4,marginBottom:20,flexWrap:'wrap'}}>
    {tabs.map(t=><button key={t.key} onClick={()=>onChange(t.key)} style={{
      flex:1,padding:'10px 16px',borderRadius:10,border:'none',fontFamily:f,fontSize:14,fontWeight:600,
      transition:'all .2s',minWidth:'fit-content',
      background:active===t.key?'#fff':'transparent',color:active===t.key?'#16a34a':'#6b7280',
      boxShadow:active===t.key?'0 1px 3px rgba(0,0,0,.08)':'none'
    }}>{t.label}</button>)}
  </div>
)

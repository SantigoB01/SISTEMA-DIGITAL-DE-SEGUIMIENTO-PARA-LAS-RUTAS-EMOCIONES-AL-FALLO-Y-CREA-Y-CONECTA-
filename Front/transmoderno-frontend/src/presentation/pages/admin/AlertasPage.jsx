import { useState } from 'react'
import { useAlertas } from '../../../application/hooks'
import { Btn, Input, Table, Pagination, PageHeader, TabBar, Badge, Card } from '../../components/ui/index'
import Icon from '../../components/ui/Icon'

export default function AlertasPage() {
  const al = useAlertas()
  const [tab, setTab] = useState('ayuda')
  const [numero, setNumero] = useState('')
  const [saving, setSaving] = useState(false)

  const crear = async () => { setSaving(true); try { await al.crearSolicitud(numero); setNumero('') } catch {} setSaving(false) }

  return <div>
    <PageHeader title="Alertas" subtitle="Solicitudes de ayuda e inasistencias"/>
    <TabBar tabs={[{key:'ayuda',label:'Solicitudes'},{key:'inasistencia',label:'Inasistencias'},{key:'nueva',label:'Levantar mano'}]} active={tab} onChange={setTab}/>
    {tab==='ayuda'&&<><Table columns={[{key:'id',label:'ID'},{key:'participanteId',label:'Participante'},{key:'fechaHora',label:'Fecha',render:v=>v?.replace('T',' ').substring(0,19)},{key:'atendida',label:'Estado',render:v=><Badge text={v?'Atendida':'Pendiente'} color={v?'#16a34a':'#f59e0b'}/>},{key:'atendidaPor',label:'Atendida por',render:v=>v||'—'}]} data={al.solicitudes} actions={row=>!row.atendida&&<Btn size="sm" onClick={()=>al.atender(row.id)}>Atender</Btn>}/><Pagination page={al.solPage} totalPages={al.solTotalPages} onChange={p=>al.loadSolicitudes(p)}/></>}
    {tab==='inasistencia'&&<Table columns={[{key:'numeroIdentificacion',label:'Identificación'},{key:'nombreCompleto',label:'Nombre'},{key:'nombreRuta',label:'Ruta'},{key:'ultimaAsistencia',label:'Última',render:v=>v?v.split('T')[0]:'Nunca'},{key:'diasSinAsistir',label:'Días',render:v=>v===-1?'Nunca':v+' días'}]} data={al.inasistencias}/>}
    {tab==='nueva'&&<Card style={{maxWidth:400,textAlign:'center'}}><div style={{width:56,height:56,borderRadius:'50%',background:'#fef3c7',display:'inline-flex',alignItems:'center',justifyContent:'center',marginBottom:8}}><Icon name="hand" size={28} color="#f59e0b"/></div><h4 style={{margin:'0 0 4px'}}>Levantar la mano</h4><p style={{margin:'0 0 16px',fontSize:13,color:'#6b7280'}}>Solicitud discreta de orientación</p><Input label="Nro identificación" value={numero} onChange={e=>setNumero(e.target.value)}/><Btn onClick={crear} disabled={saving} style={{width:'100%'}}>{saving?'Enviando...':'Enviar'}</Btn></Card>}
  </div>
}

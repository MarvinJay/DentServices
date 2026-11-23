import React from 'react'
import Card from './Card'

export default function Lane({ title, items, onItemClick, onDropItem }: { title: string; items: any[]; onItemClick?: (it:any)=>void; onDropItem?: (id:string, stage:string)=>void }){
  function handleDragOver(e: React.DragEvent){
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  function handleDrop(e: React.DragEvent){
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain')
    if(id && onDropItem) onDropItem(id, title)
  }

  return (
    <div className="lane">
      <div className="lane-head">{title}</div>
      <div className="lane-body" onDragOver={handleDragOver} onDrop={handleDrop}>
        {items.length===0 ? <div style={{color:'#9ca3af'}}>No items</div> : items.map(i=> <Card key={i.id} item={i} onClick={onItemClick} />)}
      </div>
    </div>
  )
}

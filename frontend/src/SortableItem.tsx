// import { useSortable } from '@dnd-kit/sortable'
// import { CSS } from '@dnd-kit/utilities'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faGripLines } from '@fortawesome/free-solid-svg-icons';

// interface SortableItemProps {
//   id: string
//   name: string
//   score: number
//   description?: string
//   onDelete?: (id: string, name: string) => void
// }

// export default function SortableItem({
//   id,
//   name,
//   score,
//   description,
//   onDelete
// }: SortableItemProps) {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//     isDragging,
//   } = useSortable({ id })

//   const style: React.CSSProperties = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     padding: '1rem',
//     marginBottom: '10px',
//     border: '2px solid #ccc',
//     borderRadius: '8px',
//     backgroundColor: isDragging ? '#e0f7fa' : '#f9f9f9',
//     boxShadow: isDragging ? '0 0 10px rgba(0,0,0,0.2)' : '2px 2px 6px rgba(0,0,0,0.1)',
//     cursor: 'grab',
//     position: 'relative',
//   }

//   const buttonStyle = {
//     position: 'absolute' as const,
//     top: '8px',
//     right: '8px',
//     padding: '0.3rem 0.6rem',
//     backgroundColor: 'red',
//     color: 'white',
//     border: 'none',
//     borderRadius: '4px',
//     cursor: 'pointer',
//   }

//   return (
//     <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
//       <strong style={{ fontFamily: 'Times New Roman', fontWeight: 'bold' }}>
//         {name}
//       </strong>
//       <p>Score: {score}</p>
//       <p><strong>Description:</strong> {description}</p>
//       {onDelete && (
//         <button
//           style={buttonStyle}
//           onClick={() => {
//             // e.stopPropagation() // Prevent drag when clicking delete
//             onDelete(id, name)
//           }}
//         >
//           Delete
//         </button>
//       )}
//       <div>
//         <FontAwesomeIcon icon={faGripLines} />
//       </div>
//     </div>
//   )
// }

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripLines } from '@fortawesome/free-solid-svg-icons';
import { supabase } from './supabaseClient';

interface SortableItemProps {
  id: string
  name: string
  score: number
  description?: string
  onDelete?: (id: string, name: string) => void
  onShippedUpdate?: (id: string) => void
}

export default function SortableItem({
  id,
  name,
  score,
  description,
  onDelete,
  onShippedUpdate
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: '1rem',
    marginBottom: '10px',
    border: '2px solid #ccc',
    borderRadius: '8px',
    backgroundColor: isDragging ? '#e0f7fa' : '#f9f9f9',
    boxShadow: isDragging ? '0 0 10px rgba(0,0,0,0.2)' : '2px 2px 6px rgba(0,0,0,0.1)',
    cursor: 'grab',
    position: 'relative',
  }

  const buttonStyle = {
    position: 'absolute' as const,
    top: '8px',
    right: '8px',
    padding: '0.3rem 0.6rem',
    backgroundColor: 'red',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  }

  const handleAddToShipped = async () => {
    const confirmed = window.confirm(`Mark ${name} as shipped?`)
    if (!confirmed) return

    const { error } = await supabase.from('priority_queue').update({ shipped: true }).eq('id', id)
    if (!error && onShippedUpdate) {
      onShippedUpdate(id)
    } else if (error) {
      alert('Failed to update shipped status')
    }
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <strong style={{ fontFamily: 'Times New Roman', fontWeight: 'bold' }}>
        {name}
      </strong>
      <p>Score: {score}</p>
      <p><strong>Description:</strong> {description}</p>
      {onDelete && (
        <button
          style={buttonStyle}
          onClick={() => onDelete(id, name)}
        >
          Delete
        </button>
      )}
      <div>
        <FontAwesomeIcon icon={faGripLines} />
      </div>
      <button
        style={{
          marginTop: '10px',
          backgroundColor: 'green',
          color: 'white',
          padding: '0.5rem',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
        onClick={handleAddToShipped}
      >
        Add to Shipped
      </button>
    </div>
  )
}

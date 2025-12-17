import React from 'react'
import Image from 'next/image'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const ImageCard = ({url,index,handleRemoveImage,id}: {url:string,index:number,handleRemoveImage:(index:number)=>void,id:string}) => {
  const {attributes, listeners, setNodeRef, transform} = useSortable({
    id,
})
    const style = {
        transition: 'transform 0.2s ease-in-out',
        transform: CSS.Transform.toString(transform),
    }
  return (
    <div ref={setNodeRef} style={style} className="relative h-40" id={url} {...attributes} {...listeners}>
                                    <Image
                                        src={url}
                                        alt={`Uploaded image ${index + 1}`}
                                        className="h-full w-full object-cover rounded-lg"
                                        width={100}
                                        height={100}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    >
                                        ×
                                    </button>
                                </div>
  )
}

export default ImageCard
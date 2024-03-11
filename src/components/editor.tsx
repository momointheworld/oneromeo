'use client'
import React, { useState } from 'react';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import dynamic from 'next/dynamic';

const Quill = dynamic(() => import('react-quill'), {
  // Set this to `false` so it is only loaded on the client.
  ssr: false,
  loading: () => <p>Loading ...</p>, 
})

function Editor() {
  const [editorValue, setEditorValue] = useState('');
  const modules = {
    toolbar: {
      container: [
        [{ header: [2, 3, 4, false] }],
        ["bold", "italic", "underline", "blockquote"],
        [{ color: [] }],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        ["link", "image"],
        ["clean"],
      ],
    },
    clipboard: {
      matchVisual: true,
    },
  }

  return (
    <div className='bg-white w-full'>
    <Quill
      value={editorValue}
      onChange={(value) => setEditorValue(value)}
      modules={modules}
      theme='snow'
    />
    </div>
  );
}

export default Editor;
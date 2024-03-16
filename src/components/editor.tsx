'use client'
import { Editor, EditorContent } from '@tiptap/react'
import React from 'react'


interface MenuBarProps {
  editor: Editor | null; // Define the type of the editor prop
  onYoutubeClick: () => void;
  widthRef: React.RefObject<HTMLInputElement>;
  heightRef: React.RefObject<HTMLInputElement>;
}

const MenuBar: React.FC<MenuBarProps> = ({ editor, onYoutubeClick, widthRef, heightRef}) => {
  
  if (!editor) {
    return null
  }


  return (
    <div id='tiptap'>
      <div>
      <button
      type="button"
        onClick={() => editor.chain().focus().setColor('#958DF1').run()}
        className={editor.isActive('textStyle', { color: '#958DF1' }) ? 'is-active' : ''}
        data-testid="setPurple"
      >
        purple
      </button>
      <button
      type="button"
        onClick={() => editor.chain().focus().setColor('#F98181').run()}
        className={editor.isActive('textStyle', { color: '#F98181' }) ? 'is-active' : ''}
        data-testid="setRed"
      >
        red
      </button>
      <button
      type="button"
        onClick={() => editor.chain().focus().setColor('#FBBC88').run()}
        className={editor.isActive('textStyle', { color: '#FBBC88' }) ? 'is-active' : ''}
        data-testid="setOrange"
      >
        orange
      </button>
      <button
      type="button"
        onClick={() => editor.chain().focus().setColor('#FAF594').run()}
        className={editor.isActive('textStyle', { color: '#FAF594' }) ? 'is-active' : ''}
        data-testid="setYellow"
      >
        yellow
      </button>
      <button
      type="button"
        onClick={() => editor.chain().focus().setColor('#70CFF8').run()}
        className={editor.isActive('textStyle', { color: '#70CFF8' }) ? 'is-active' : ''}
        data-testid="setBlue"
      >
        blue
      </button>
      <button
       type="button"
        onClick={() => editor.chain().focus().setColor('#94FADB').run()}
        className={editor.isActive('textStyle', { color: '#94FADB' }) ? 'is-active' : ''}
        data-testid="setTeal"
      >
        teal
      </button>
      <button
      type="button"
        onClick={() => editor.chain().focus().setColor('#B9F18D').run()}
        className={editor.isActive('textStyle', { color: '#B9F18D' }) ? 'is-active' : ''}
        data-testid="setGreen"
      >
        green
      </button>
      <button
      type="button"
        onClick={() => editor.chain().focus().unsetColor().run()}
        data-testid="unsetColor"
      >
        unsetColor
      </button>
      <button type="button" id="add" onClick={onYoutubeClick}>Add YouTube video</button>
      <input id="width" type="number" min="320" max="1024" ref={widthRef} placeholder="width" />
      <input id="height" type="number" min="180" max="720" ref={heightRef} placeholder="height" />
    </div>
    <div>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} 
      className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}>
        h1
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
      className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}>
        h2
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} 
      className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}>
        h3
      </button>
      <button type="button" onClick={() => editor.chain().focus().setParagraph().run()} 
      className={editor.isActive('paragraph') ? 'is-active' : ''}>
        paragraph
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} 
      className={editor.isActive('bold') ? 'is-active' : ''}>
        bold
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} 
      className={editor.isActive('italic') ? 'is-active' : ''}>
        italic
      </button>
      <button
      type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active' : ''}
      >
        bullet list
      </button>
      <button
      type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'is-active' : ''}
      >
        ordered list
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} 
      className={editor.isActive('strike') ? 'is-active' : ''}>
        strike
      </button>
      <button
      type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive('codeBlock') ? 'is-active' : ''}
      >
        code block
      </button>
      <button
      type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'is-active' : ''}
      >
        blockquote
      </button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} 
      className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}>
        left
      </button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} 
      className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}>
        center
      </button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} 
      className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}>
        right
      </button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('justify').run()} 
      className={editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''}>
        justify
      </button>
      <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        horizontal rule
      </button>
      <button  type="button" onClick={() => editor.chain().focus().setHardBreak().run()}>
        hard break
      </button>
      </div>
    </div>
  )
}

interface EditorProps {
  editor: Editor | null; // Define the type of the editor prop
  onYoutubeClick: () => void;
  widthRef: React.RefObject<HTMLInputElement>;
  heightRef: React.RefObject<HTMLInputElement>;
}

const TipTap: React.FC<EditorProps> = ({ editor, onYoutubeClick, widthRef, heightRef}) => {
  return (
    <div>
      <MenuBar editor={editor} onYoutubeClick={onYoutubeClick} widthRef={widthRef} heightRef={heightRef}/>
      <EditorContent editor={editor} className='p-2 bg-zinc-50 border rounded w-full' />
    </div>
  )
}

export default TipTap;
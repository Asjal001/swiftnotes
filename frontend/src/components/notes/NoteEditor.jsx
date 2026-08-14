import {useEditor,EditorContent} from '@tiptap/react';
import {useEffect} from 'react';
import StarterKit from '@tiptap/starter-kit';
import EditorToolbar from './EditorToolbar';

const NoteEditor=({content,onChange})=>{
  const editor=useEditor({
    extensions:[StarterKit],
    content,
    onUpdate:({editor})=>{
      onChange(editor.getHTML());
    },
    editorProps:{
      attributes:{
        class: 'prose prose-slate max-w-none focus:outline-none min-h-[200px] text-slate-800 p-8',
      },
    },
  });
  useEffect(()=>{
    if(!editor) return;
    const current=editor.getHTML();
    if(content!==current){
      editor.commands.setContent(content||'');
    }
  }, [content, editor]);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};
export default NoteEditor;
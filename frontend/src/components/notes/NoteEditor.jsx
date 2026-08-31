import {useEditor,EditorContent} from '@tiptap/react';
import {useEffect,forwardRef} from 'react';
import StarterKit from '@tiptap/starter-kit';
import EditorToolbar from './EditorToolbar';

const NoteEditor=forwardRef(({content,onChange,noteId,onSummaryGenerated,onError},ref)=>{
  const editor=useEditor({
    extensions:[StarterKit],
    content,
    onUpdate:({editor})=>{
      onChange(editor.getHTML());
    },
    editorProps:{
      attributes:{
        class: 'prose prose-slate max-w-none focus:outline-none text-slate-800 p-8',
      },
    },
  });
  useEffect(()=>{
    if(!editor) return;
    const current=editor.getHTML();
    if(content!==current){
      editor.commands.setContent(content||'',false);
    }
  }, [content, editor]);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden flex flex-col h-full">
      <EditorToolbar ref={ref} editor={editor} noteId={noteId} onSummaryGenerated={onSummaryGenerated} onError={onError}/>
      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
});
export default NoteEditor;
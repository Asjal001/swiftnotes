import {Bold,Italic,Strikethrough,Heading1,Heading2,List,ListOrdered,TextQuote,Minus } from 'lucide-react';

const ToolbarButton=({onClick,isActive=false,children,ariaLabel})=>(
  <button
    type="button"
    onClick={onClick}
    aria-label={ariaLabel}
    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${isActive?'bg-slate-900 text-white':'text-slate-600 hover:bg-slate-100'}`}>
    {children}
  </button>
);
const Divider=()=><div className="w-px h-5 bg-slate-200 mx-1"/>;
const EditorToolbar=({editor})=>{
  if(!editor) return null;
  return(
    <div className="flex items-center gap-1 border-b border-slate-100 px-8 py-2 flex-wrap">
      <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} ariaLabel="Bold">
        <Bold className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} ariaLabel="Italic">
        <Italic className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} ariaLabel="Strikethrough">
        <Strikethrough className="w-4 h-4" />
      </ToolbarButton>
      <Divider />
      <ToolbarButton onClick={()=>editor.chain().focus().toggleHeading({level:1}).run()} isActive={editor.isActive('heading',{level:1})} ariaLabel="Heading 1">
        <Heading1 className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={()=>editor.chain().focus().toggleHeading({level:2}).run()} isActive={editor.isActive('heading',{level:2})} ariaLabel="Heading 2">
        <Heading2 className="w-4 h-4" />
      </ToolbarButton>
      <Divider />
      <ToolbarButton onClick={()=>editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} ariaLabel="Bullet list">
        <List className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={()=>editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} ariaLabel="Ordered list">
        <ListOrdered className="w-4 h-4" />
      </ToolbarButton>
      <Divider />
      <ToolbarButton onClick={()=>editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} ariaLabel="Blockquote">
        <TextQuote className="w-4 h-4" />
      </ToolbarButton>
      <ToolbarButton onClick={()=>editor.chain().focus().setHorizontalRule().run()} ariaLabel="Horizontal rule">
        <Minus className="w-4 h-4" />
      </ToolbarButton>
    </div>
  );
};
export default EditorToolbar;
import { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import {Bold,Italic,Strikethrough,Heading1,Heading2,List,ListOrdered,TextQuote,Minus,Mic,MicOff,Sparkles,Loader2 } from 'lucide-react';
import api from '../../api/axios';

const ToolbarButton=({onClick,isActive=false,children,ariaLabel})=>(
  <button
    type="button"
    onClick={onClick}
    aria-label={ariaLabel}
    aria-pressed={isActive}
    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${isActive?'bg-slate-900 text-white':'text-slate-600 hover:bg-slate-100'}`}>
    {children}
  </button>
);
const Divider=()=><div className="w-px h-5 bg-slate-200 mx-1"/>;
const EditorToolbar = forwardRef(({ editor, noteId, onSummaryGenerated, onError }, ref) => {
  const [recording, setRecording] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const recognitionRef = useRef(null);

  useImperativeHandle(ref, () => ({
    stopRecording: () => {
      if (recording && recognitionRef.current) {
        recognitionRef.current.stop();
        setRecording(false);
      }
    }
  }));

  if (!editor) return null;

  const toggleRecording = () => {
    if (recording) {
      recognitionRef.current?.stop();
      setRecording(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      if (onError) onError('Speech recognition is not supported in this browser. Please use Google Chrome.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    let sessionCommittedText = '';

    recognition.onresult = (event) => {
      let currentInterim = '';
      let currentFinal = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          currentFinal += transcript;
        } else {
          currentInterim += transcript;
        }
      }

      if (currentFinal) {
        sessionCommittedText += ` ${currentFinal}`;
      }
      const liveText = (sessionCommittedText + ` ${currentInterim}`).trim();
      
      if (editor && liveText) {
        editor.commands.setContent(liveText);
      }
    };

    recognition.onstart = () => {
      sessionCommittedText = editor ? editor.getText() : '';
    };

    recognition.onerror = (err) => {
      console.error('Speech recognition error', err);
      setRecording(false);
    };

    recognition.onend = () => {
      setRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setRecording(true);
  };

  const handleSummarize = async () => {
    if (!noteId) return;
    try {
      setSummarizing(true);
      const res = await api.post(`/notes/${noteId}/summarize`);
      if (res.data.data.summary && onSummaryGenerated) {
        onSummaryGenerated(res.data.data.summary);
      }
    } catch (err) {
      console.error('Summary generation failed', err);
      const errorMessage = err.response?.data?.error || 'Failed to generate summary';
      if (onError) onError(errorMessage);
    } finally {
      setSummarizing(false);
    }
  };
  return(
    <div role="toolbar" aria-label="Text formatting" className="flex items-center gap-1 border-b border-slate-100 px-8 py-2 flex-wrap">
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
      
      <div className="flex-1" />
      <button
        type="button"
        onClick={toggleRecording}
        className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-2 transition-colors font-medium ${
          recording ? 'bg-red-50 text-red-600 animate-pulse' : 'text-slate-600 hover:bg-slate-100'
        }`}
        title={recording ? 'Stop Recording' : 'Voice Typing'}
      >
        {recording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
      </button>

      {noteId && (
        <button
          type="button"
          onClick={handleSummarize}
          disabled={summarizing}
          className="px-3 py-1.5 text-sm rounded-lg flex items-center gap-2 transition-colors font-medium text-indigo-600 hover:bg-indigo-50 disabled:opacity-50"
          title="Generate AI Summary"
        >
          {summarizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span className="hidden sm:inline">{summarizing ? 'Summarizing...' : 'Summarize'}</span>
        </button>
      )}
    </div>
  );
});
export default EditorToolbar;
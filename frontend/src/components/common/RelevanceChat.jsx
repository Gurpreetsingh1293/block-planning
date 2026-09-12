import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export default function RelevanceChat() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating chat window */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: '5rem',
            right: '1.5rem',
            zIndex: 9999,
            width: '400px',
            height: '600px',
            maxWidth: '90vw',
            maxHeight: '80vh',
            borderRadius: '1rem',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
            background: '#fff',
          }}
        >
          <iframe
            src="https://app.relevanceai.com/agents/d7b62b/fb382fa6-dbe8-422e-8742-4893bed6e27d/36323df4-5015-42a9-9559-b6bcc96ff9de/embed-chat?hide_tool_steps=false&hide_file_uploads=false&hide_conversation_list=false&bubble_style=agent&primary_color=%23685FFF&bubble_icon=pd%2Fchat&input_placeholder_text=Type+your+message...&hide_logo=false&hide_description=false"
            width="100%"
            height="100%"
            frameBorder="0"
            allow="microphone"
            title="AI Assistant"
          />
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 9999,
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: '#685FFF',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(104,95,255,0.45)',
        }}
        title={open ? 'Close AI Assistant' : 'Open AI Assistant'}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </>
  );
}

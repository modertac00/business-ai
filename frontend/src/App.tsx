import { useDocStore } from './hooks/useDocStore'
import Topbar from './components/Layout/Topbar'
import Sidebar from './components/Sidebar/Sidebar'
import Editor from './components/Editor/Editor'
import ChatPanel from './components/Chat/ChatPanel'
import styles from './components/Layout/Layout.module.css'
import './styles/globals.css'

export default function App() {
  const {
    folders, activeFileId, loading,
    setActiveFileId, addFolder, addDocument,
    docTitle, setDocTitle,
    sections, addSection, updateSection,
    messages, input, setInput, sendMessage, sending,
  } = useDocStore()

  return (
    <div className={styles.layout}>
      <Topbar />

      <Sidebar
        folders={folders}
        activeFileId={activeFileId}
        onSelectFile={setActiveFileId}
        onAddFolder={addFolder}
        onAddDocument={addDocument}
        loading={loading}
      />

      <Editor
        title={docTitle}
        sections={sections}
        activeDocumentId={activeFileId}
        onTitleChange={setDocTitle}
        onUpdateSection={updateSection}
        onAddSection={addSection}
      />

      <ChatPanel
        messages={messages}
        docTitle={docTitle}
        input={input}
        sending={sending}
        onInputChange={setInput}
        onSend={sendMessage}
      />
    </div>
  )
}

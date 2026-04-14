import { useDocStore } from './hooks/useDocStore'
import Topbar from './components/Layout/Topbar'
import Sidebar from './components/Sidebar/Sidebar'
import Editor from './components/Editor/Editor'
import ChatPanel from './components/Chat/ChatPanel'
import styles from './components/Layout/Layout.module.css'
import './styles/globals.css'

export default function App() {
  const {
    folders, activeFileId, setActiveFileId,
    docTitle, setDocTitle,
    sections, addSection, updateSection,
    messages, input, setInput, sendMessage,
    addFolder,
  } = useDocStore()

  return (
    <div className={styles.layout}>
      <Topbar />

      <Sidebar
        folders={folders}
        activeFileId={activeFileId}
        onSelectFile={setActiveFileId}
        onAddFolder={addFolder}
        onNewDoc={addSection}
      />

      <Editor
        title={docTitle}
        sections={sections}
        onTitleChange={setDocTitle}
        onUpdateSection={updateSection}
        onAddSection={addSection}
      />

      <ChatPanel
        messages={messages}
        docTitle={docTitle}
        input={input}
        onInputChange={setInput}
        onSend={sendMessage}
      />
    </div>
  )
}

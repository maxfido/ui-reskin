import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type MessageRole = 'fido' | 'user'
export type CardType = 'health-summary' | 'lender-match'

export interface Message {
  id: string
  role: MessageRole
  content: string
  timestamp: number
  card?: CardType
}

export interface Conversation {
  id: string
  skillId: string
  title: string
  createdAt: number
  messages: Message[]
}

interface ChatState {
  conversations: Conversation[]
  activeConversationId: string | null
  isTyping: boolean

  createConversation: (skillId: string, opener: string) => string
  setActiveConversation: (id: string) => void
  addMessage: (conversationId: string, msg: Omit<Message, 'id' | 'timestamp'>) => void
  setTyping: (v: boolean) => void
  deleteConversation: (id: string) => void
  getConversationsForSkill: (skillId: string) => Conversation[]
  getActiveConversation: () => Conversation | null
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,
      isTyping: false,

      createConversation: (skillId, opener) => {
        const id = `conv-${Date.now()}`
        const openingMsg: Message = {
          id: `msg-${Date.now()}`,
          role: 'fido',
          content: opener,
          timestamp: Date.now(),
        }
        const conv: Conversation = {
          id,
          skillId,
          title: `New conversation`,
          createdAt: Date.now(),
          messages: [openingMsg],
        }
        set((s) => ({ conversations: [conv, ...s.conversations], activeConversationId: id }))
        return id
      },

      setActiveConversation: (id) => set({ activeConversationId: id }),

      addMessage: (conversationId, msg) => {
        const fullMsg: Message = { ...msg, id: `msg-${Date.now()}`, timestamp: Date.now() }
        set((s) => ({
          conversations: s.conversations.map((c) => {
            if (c.id !== conversationId) return c
            const messages = [...c.messages, fullMsg]
            const userMessages = messages.filter((m) => m.role === 'user')
            const title = userMessages[0]?.content.slice(0, 48) || c.title
            return { ...c, messages, title }
          }),
        }))
      },

      setTyping: (v) => set({ isTyping: v }),

      deleteConversation: (id) =>
        set((s) => ({
          conversations: s.conversations.filter((c) => c.id !== id),
          activeConversationId: s.activeConversationId === id ? null : s.activeConversationId,
        })),

      getConversationsForSkill: (skillId) =>
        get().conversations.filter((c) => c.skillId === skillId),

      getActiveConversation: () => {
        const { conversations, activeConversationId } = get()
        return conversations.find((c) => c.id === activeConversationId) ?? null
      },
    }),
    { name: 'fido-chat' }
  )
)

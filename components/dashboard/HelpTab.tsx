"use client"

import { useState, useEffect } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { FormattedMessage, useIntl } from "react-intl"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  HelpCircle, 
  User, 
  CreditCard, 
  Mail, 
  Search,
  ExternalLink,
  MessageCircle,
  ArrowRight,
  AlertCircle
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Definição dos tipos para as perguntas
interface Question {
  id: string
  value: string
  questionId: string
  answerId: string
  icon: React.ReactNode
  iconBgColor: string
}

export default function HelpTab() {
  const intl = useIntl()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeItem, setActiveItem] = useState<string | null>(null)
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Lista de perguntas com seus respectivos IDs de tradução
  const questions: Question[] = [
    {
      id: "item-1",
      value: "item-1",
      questionId: "updateProfileQuestion",
      answerId: "updateProfileAnswer",
      icon: <User className="h-5 w-5 text-blue-400" />,
      iconBgColor: "bg-blue-500/20"
    },
    {
      id: "item-2",
      value: "item-2",
      questionId: "updatePaymentQuestion",
      answerId: "updatePaymentAnswer",
      icon: <CreditCard className="h-5 w-5 text-green-400" />,
      iconBgColor: "bg-green-500/20"
    },
    {
      id: "item-3",
      value: "item-3",
      questionId: "needHelpQuestion",
      answerId: "needHelpAnswer",
      icon: <MessageCircle className="h-5 w-5 text-amber-400" />,
      iconBgColor: "bg-amber-500/20"
    }
  ]

  // Filtrar perguntas com base na pesquisa
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredQuestions(questions)
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    const lowerCaseQuery = searchQuery.toLowerCase()
    
    const filtered = questions.filter(question => {
      const questionText = intl.formatMessage({ id: question.questionId }).toLowerCase()
      const answerText = intl.formatMessage({ id: question.answerId }).toLowerCase()
      
      return questionText.includes(lowerCaseQuery) || answerText.includes(lowerCaseQuery)
    })
    
    setFilteredQuestions(filtered)
  }, [searchQuery, intl])

  // Destacar o texto pesquisado
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text
    
    const regex = new RegExp(`(${query.trim()})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, i) => 
      regex.test(part) ? <span key={i} className="bg-blue-500/30 text-white">{part}</span> : part
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Cabeçalho com resumo */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-[#1A1D2E] to-[#252A44] p-6 rounded-lg shadow-lg border border-gray-800"
      >
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="bg-purple-500/20 p-3 rounded-full mr-4">
              <HelpCircle className="h-8 w-8 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white"><FormattedMessage id="helpSupport" /></h2>
              <p className="text-gray-400"><FormattedMessage id="findAnswers" /></p>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Barra de pesquisa */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="relative"
      >
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
        <input 
          type="text"
          placeholder={intl.formatMessage({ id: "searchQuestions" })}
          className="w-full bg-[#131629] border border-gray-800 text-white rounded-md pl-10 py-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </motion.div>
      
      {/* Accordion com perguntas */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="space-y-4"
      >
        {isSearching && filteredQuestions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[#131629] p-5 rounded-lg border border-gray-800 text-center"
          >
            <AlertCircle className="h-8 w-8 text-amber-400 mx-auto mb-2" />
            <p className="text-gray-300"><FormattedMessage id="noResultsFound" /></p>
          </motion.div>
        ) : (
          <Accordion 
            type="single" 
            collapsible 
            className="space-y-4"
            onValueChange={(value) => setActiveItem(value)}
          >
            {filteredQuestions.map((question) => (
              <AccordionItem key={question.id} value={question.value} className="border-none">
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <AccordionTrigger className="bg-gradient-to-r from-[#1A1D2E]/80 to-[#131629]/80 hover:from-[#1A1D2E] hover:to-[#131629] rounded-lg border border-gray-800 hover:border-gray-700 shadow-md px-5 py-4 hover:no-underline">
                    <div className="flex items-center">
                      <div className={`${question.iconBgColor} p-2 rounded-full mr-3`}>
                        {question.icon}
                      </div>
                      <span>
                        {searchQuery.trim() 
                          ? highlightText(intl.formatMessage({ id: question.questionId }), searchQuery) 
                          : <FormattedMessage id={question.questionId} />
                        }
                      </span>
                    </div>
                  </AccordionTrigger>
                </motion.div>
                <AnimatePresence>
                  {activeItem === question.value && (
                    <AccordionContent className="bg-[#131629] p-5 rounded-lg border border-gray-800 mt-2 text-gray-300">
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        {searchQuery.trim() 
                          ? highlightText(intl.formatMessage({ id: question.answerId }), searchQuery) 
                          : <FormattedMessage id={question.answerId} />
                        }
                        {question.id === "item-3" && (
                          <a href="mailto:support@nb1.ai" className="text-blue-400 hover:text-blue-300 ml-1">
                            support@nb1.ai
                          </a>
                        )}
                      </motion.div>
                    </AccordionContent>
                  )}
                </AnimatePresence>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </motion.div>
      
      {/* Seção de contato direto */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Card className="bg-gradient-to-b from-[#1A1D2E] to-[#131629] border-gray-800 rounded-lg shadow-lg overflow-hidden hover:border-gray-700 transition-all">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="bg-blue-500/20 p-3 rounded-full">
                <Mail className="h-6 w-6 text-blue-400" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-lg font-medium text-white"><FormattedMessage id="needMoreHelp" /></h3>
                <p className="text-gray-400"><FormattedMessage id="ourTeamReady" /></p>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center group"
                  onClick={() => window.location.href = "mailto:support@nb1.ai"}
                >
                  <FormattedMessage id="contactSupport" />
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

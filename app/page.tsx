'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

// Inicializa o Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Tipos
interface Lead {
  id?: number
  username: string
  nome_completo: string
  bio: string
  seguidores: number
  foto_url?: string
  status?: string
}

export default function Home() {
  // Estados da Busca
  const [alvo, setAlvo] = useState('')
  const [local, setLocal] = useState('')
  const [seguidores, setSeguidores] = useState('') // Adicionado estado para seguidores
  const [loading, setLoading] = useState(false)

  // Estados dos Resultados
  const [leads, setLeads] = useState<Lead[]>([])

  // Carregar leads ao abrir a tela
  useEffect(() => {
    fetchLeads()
  }, [])

  async function fetchLeads() {
    const { data } = await supabase
      .from('perfis_encontrados')
      .select('*')
      .order('id', { ascending: false })
    
    if (data) setLeads(data)
  }

  // --- FUNÇÃO CORRIGIDA QUE CHAMA A API ---
  async function handleDispararBusca() {
    if (!alvo) return alert('Defina um alvo!')
    setLoading(true)
    
    try {
      // 1. Chama o nosso Robô (API)
      const resposta = await fetch('/api/buscar-insta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alvo, local, seguidores })
      })

      const json = await resposta.json()

      // 2. Se deu certo, salva no banco
      if (json.success && json.data) {
        const novosLeads = json.data
        
        // Salvando missão no histórico
        await supabase.from('missoes').insert([{ conta_alvo: alvo, localizacao: local, status: 'Concluido' }])

        // Salvando os perfis encontrados
        const { error } = await supabase.from('perfis_encontrados').insert(novosLeads)
        
        if (!error) {
          fetchLeads() // Atualiza a lista na tela
          alert(`🎯 Sucesso! Encontramos ${novosLeads.length} novos alvos.`)
        } else {
          console.error(error)
        }
      } else {
        alert('Erro ao buscar dados na API.')
      }

    } catch (error) {
      console.error(error)
      alert('Erro de conexão.')
    }

    setLoading(false)
    setAlvo('')
  }

  function abrirNoInstagram(username: string) {
    window.open(`https://instagram.com/${username}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 font-mono pb-20">
      
      {/* --- CABEÇALHO --- */}
      <div className="max-w-md mx-auto mb-8 text-center pt-6">
        <h1 className="text-3xl font-bold text-green-500 tracking-wider">SNIPER LEADS</h1>
        <p className="text-gray-500 text-xs mt-1">SISTEMA DE AQUISIÇÃO DE ALVOS</p>
      </div>

      {/* --- MIRA (CONFIGURAÇÃO) --- */}
      <div className="max-w-md mx-auto bg-gray-900 p-6 rounded-xl border border-green-900 mb-8">
        <h2 className="text-xs uppercase text-green-700 mb-4 font-bold border-b border-green-900 pb-2">Nova Missão</h2>
        <div className="space-y-4">
          
          <div>
             <label className="text-xs text-gray-500 mb-1 block">CONTA ALVO</label>
             <div className="flex items-center bg-gray-800 rounded border border-gray-700">
              <span className="pl-3 text-gray-500">@</span>
              <input 
                type="text" 
                value={alvo}
                onChange={(e) => setAlvo(e.target.value)}
                className="w-full p-3 bg-transparent outline-none text-white"
                placeholder="ex: graciebarra"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">LOCAL</label>
              <input 
                type="text" 
                value={local}
                onChange={(e) => setLocal(e.target.value)}
                className="w-full p-3 bg-gray-800 rounded border border-gray-700 outline-none text-white"
                placeholder="Gold Coast"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">MIN. SEGUIDORES</label>
              <input 
                type="number" 
                value={seguidores}
                onChange={(e) => setSeguidores(e.target.value)}
                className="w-full p-3 bg-gray-800 rounded border border-gray-700 outline-none text-white"
                placeholder="200"
              />
            </div>
          </div>

          <button 
            onClick={handleDispararBusca}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-500 text-black font-bold py-3 rounded uppercase tracking-widest text-sm transition-all"
          >
            {loading ? 'RASTREANDO...' : 'INICIAR EXTRAÇÃO'}
          </button>
        </div>
      </div>

      {/* --- RESULTADOS --- */}
      <div className="max-w-md mx-auto">
        <h2 className="text-xs uppercase text-gray-500 mb-4 font-bold pl-2">Alvos Identificados ({leads.length})</h2>
        
        <div className="space-y-4">
          {leads.map((lead) => (
            <div key={lead.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex flex-col gap-3">
              
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gray-700 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center">
                   {lead.foto_url && !lead.foto_url.includes('ui-avatars') ? (
                      <img src={lead.foto_url} alt={lead.username} className="w-full h-full object-cover"/>
                   ) : (
                      <span className="text-green-500 font-bold text-xl">{lead.username[0]?.toUpperCase()}</span>
                   )}
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">@{lead.username}</h3>
                  <p className="text-sm text-gray-400">{lead.nome_completo}</p>
                  <p className="text-xs text-gray-500 mt-1">{lead.seguidores} seguidores • {lead.bio}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-1">
                <button className="bg-gray-700 hover:bg-red-900 text-gray-300 py-2 rounded text-xs font-bold uppercase">
                  Ignorar
                </button>
                <button 
                  onClick={() => abrirNoInstagram(lead.username)}
                  className="bg-green-600 hover:bg-green-500 text-black py-2 rounded text-xs font-bold uppercase flex items-center justify-center gap-2"
                >
                  Ver no Insta ↗
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
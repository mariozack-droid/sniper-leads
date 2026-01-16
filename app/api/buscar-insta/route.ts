import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { alvo, local, seguidores } = body

    // Simulando tempo de busca (2 segundos)
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Gerando resultados baseados na busca
    const resultadosSimulados = [
      {
        username: `${alvo}_fighter`,
        nome_completo: `Aluno do ${alvo}`,
        bio: `Jiu Jitsu lifestyle em ${local || 'Gold Coast'}. Oss!`,
        seguidores: 1200,
        foto_url: "https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=AF"
      },
      {
        username: `bjj_${local ? local.replace(/\s/g, '').toLowerCase() : 'gc'}`,
        nome_completo: 'BJJ Local Hero',
        bio: 'Competidor | Personal Trainer',
        seguidores: 850,
        foto_url: "https://ui-avatars.com/api/?background=random&name=BH"
      },
      {
        username: `${alvo}_fan_club`,
        nome_completo: 'Fã Clube Oficial',
        bio: 'Acompanhando a jornada.',
        seguidores: 300,
        foto_url: "https://ui-avatars.com/api/?background=random&name=FC"
      }
    ]

    return NextResponse.json({ success: true, data: resultadosSimulados })
    
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro no processamento' }, { status: 500 })
  }
}
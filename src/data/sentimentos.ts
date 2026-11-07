export interface SentimentText {
  id: number;
  sentiment: string;
  author: 'IA' | 'Humano';
  text: string;
}

export const SENTIMENTOS_DATABASE: SentimentText[] = [
  {
    "id": 1,
    "sentiment": "Família",
    "author": "IA",
    "text": "A família representa um espaço de acolhimento, onde os vínculos afetivos podem oferecer segurança, apoio e compreensão diante dos desafios da vida."
  },
  {
    "id": 2,
    "sentiment": "Família",
    "author": "IA",
    "text": "Estar com a família nos momentos importantes fortalece os laços e cria lembranças que permanecem ao longo do tempo."
  },
  {
    "id": 3,
    "sentiment": "Família",
    "author": "IA",
    "text": "A família nem sempre é perfeita, mas pode ser uma fonte significativa de amor, aprendizado e crescimento pessoal."
  },
  {
    "id": 4,
    "sentiment": "Família",
    "author": "IA",
    "text": "Compartilhar momentos simples com pessoas queridas demonstra que a felicidade pode estar presente nas pequenas experiências do cotidiano."
  },
  {
    "id": 5,
    "sentiment": "Raiva",
    "author": "IA",
    "text": "A raiva surge quando sentimos que nossos limites foram ultrapassados ou que algo importante para nós foi desrespeitado."
  },
  {
    "id": 6,
    "sentiment": "Raiva",
    "author": "IA",
    "text": "Em determinados momentos, a intensidade da raiva dificulta a compreensão dos acontecimentos e torna necessário um tempo para recuperar a calma."
  },
  {
    "id": 7,
    "sentiment": "Raiva",
    "author": "IA",
    "text": "A raiva pode revelar sentimentos de injustiça, frustração ou impotência diante de situações que não conseguimos controlar."
  },
  {
    "id": 8,
    "sentiment": "Raiva",
    "author": "IA",
    "text": "Sentir raiva é uma reação natural, mas compreender suas causas permite transformar essa emoção em atitudes mais conscientes."
  },
  {
    "id": 9,
    "sentiment": "Felicidade",
    "author": "IA",
    "text": "A felicidade pode ser encontrada em momentos simples, como uma conversa agradável, uma conquista pessoal ou a presença de alguém especial."
  },
  {
    "id": 10,
    "sentiment": "Felicidade",
    "author": "IA",
    "text": "Quando alcançamos um objetivo importante, sentimos uma satisfação que reconhece todo o esforço realizado durante o caminho."
  },
  {
    "id": 11,
    "sentiment": "Felicidade",
    "author": "IA",
    "text": "A felicidade não depende exclusivamente de grandes acontecimentos, pois também pode surgir nas pequenas experiências do cotidiano."
  },
  {
    "id": 12,
    "sentiment": "Felicidade",
    "author": "IA",
    "text": "Experimentar a felicidade significa reconhecer os momentos positivos e valorizar aquilo que contribui para o nosso bem-estar."
  },
  {
    "id": 13,
    "sentiment": "Ansiedade",
    "author": "IA",
    "text": "A ansiedade aparece quando a mente antecipa situações futuras, criando preocupações sobre acontecimentos que ainda não ocorreram."
  },
  {
    "id": 14,
    "sentiment": "Ansiedade",
    "author": "IA",
    "text": "A espera por uma resposta importante pode provocar inquietação, dificultando a concentração e aumentando a sensação de insegurança."
  },
  {
    "id": 15,
    "sentiment": "Ansiedade",
    "author": "IA",
    "text": "A ansiedade transforma possibilidades em preocupações constantes, fazendo com que o futuro pareça mais ameaçador do que realmente é."
  },
  {
    "id": 16,
    "sentiment": "Ansiedade",
    "author": "IA",
    "text": "Aprender a lidar com a ansiedade envolve reconhecer os pensamentos preocupantes e desenvolver estratégias para enfrentar as incertezas."
  },
  {
    "id": 17,
    "sentiment": "Tristeza",
    "author": "IA",
    "text": "A tristeza é uma emoção que surge diante de perdas, decepções ou situações que provocam sofrimento emocional."
  },
  {
    "id": 18,
    "sentiment": "Tristeza",
    "author": "IA",
    "text": "Existem momentos em que a tristeza parece ocupar todos os pensamentos, tornando as atividades cotidianas mais difíceis de realizar."
  },
  {
    "id": 19,
    "sentiment": "Tristeza",
    "author": "IA",
    "text": "Sentir tristeza não significa fraqueza, mas representa uma resposta emocional a experiências que possuem significado para nós."
  },
  {
    "id": 20,
    "sentiment": "Tristeza",
    "author": "IA",
    "text": "A tristeza pode nos levar a refletir sobre nossas necessidades, nossos vínculos e aquilo que realmente valorizamos."
  },
  {
    "id": 21,
    "sentiment": "Dúvida/incerteza",
    "author": "IA",
    "text": "A incerteza surge quando precisamos tomar decisões sem possuir todas as informações necessárias para compreender suas possíveis consequências."
  },
  {
    "id": 22,
    "sentiment": "Dúvida/incerteza",
    "author": "IA",
    "text": "Diante de diferentes caminhos, a dúvida pode dificultar a escolha e gerar receio de tomar uma decisão equivocada."
  },
  {
    "id": 23,
    "sentiment": "Dúvida/incerteza",
    "author": "IA",
    "text": "Não saber o que acontecerá no futuro pode provocar insegurança, especialmente quando estão envolvidos objetivos importantes."
  },
  {
    "id": 24,
    "sentiment": "Dúvida/incerteza",
    "author": "IA",
    "text": "A dúvida faz parte do processo de reflexão e pode contribuir para decisões mais cuidadosas e conscientes."
  },
  {
    "id": 25,
    "sentiment": "Remorso",
    "author": "IA",
    "text": "O remorso aparece quando reconhecemos que nossas atitudes causaram sofrimento a alguém ou contrariaram nossos próprios valores."
  },
  {
    "id": 26,
    "sentiment": "Remorso",
    "author": "IA",
    "text": "Algumas lembranças permanecem dolorosas porque representam decisões que gostaríamos de ter tomado de maneira diferente."
  },
  {
    "id": 27,
    "sentiment": "Remorso",
    "author": "IA",
    "text": "Sentir remorso pode ser uma oportunidade para reconhecer erros, assumir responsabilidades e buscar formas de reparar suas consequências."
  },
  {
    "id": 28,
    "sentiment": "Remorso",
    "author": "IA",
    "text": "O peso de uma atitude passada pode continuar presente mesmo quando compreendemos que não é possível modificar o que aconteceu."
  },
  {
    "id": 29,
    "sentiment": "Melancolia",
    "author": "IA",
    "text": "A melancolia é uma sensação de tristeza profunda e contemplativa, frequentemente associada às lembranças, à passagem do tempo e à reflexão."
  },
  {
    "id": 30,
    "sentiment": "Melancolia",
    "author": "IA",
    "text": "Algumas paisagens, músicas ou situações despertam uma melancolia que mistura sentimentos de saudade, nostalgia e introspecção."
  },
  {
    "id": 31,
    "sentiment": "Melancolia",
    "author": "IA",
    "text": "A melancolia pode surgir mesmo em momentos tranquilos, trazendo uma sensação de vazio difícil de explicar."
  },
  {
    "id": 32,
    "sentiment": "Melancolia",
    "author": "IA",
    "text": "Existe uma dimensão contemplativa na melancolia, que nos conduz a refletir sobre experiências passadas e mudanças inevitáveis da vida."
  },
  {
    "id": 33,
    "sentiment": "Frustração",
    "author": "IA",
    "text": "A frustração ocorre quando nossas expectativas não correspondem aos resultados alcançados, provocando insatisfação e desânimo."
  },
  {
    "id": 34,
    "sentiment": "Frustração",
    "author": "IA",
    "text": "Dedicar muito esforço a um objetivo e não conseguir alcançá-lo pode gerar uma sensação de impotência e desapontamento."
  },
  {
    "id": 35,
    "sentiment": "Frustração",
    "author": "IA",
    "text": "A frustração evidencia a diferença entre aquilo que desejamos e as circunstâncias que encontramos durante nossas tentativas."
  },
  {
    "id": 36,
    "sentiment": "Frustração",
    "author": "IA",
    "text": "Embora desconfortável, a frustração pode contribuir para a revisão de estratégias e para o desenvolvimento de novas perspectivas."
  },
  {
    "id": 37,
    "sentiment": "Traição",
    "author": "IA",
    "text": "A traição rompe a confiança construída em uma relação e pode provocar sentimentos de decepção, insegurança e sofrimento."
  },
  {
    "id": 38,
    "sentiment": "Traição",
    "author": "IA",
    "text": "Descobrir que alguém em quem confiávamos agiu de maneira desleal pode modificar profundamente nossa percepção sobre essa pessoa."
  },
  {
    "id": 39,
    "sentiment": "Traição",
    "author": "IA",
    "text": "A traição não afeta apenas o vínculo entre indivíduos, mas também pode comprometer a capacidade de confiar novamente."
  },
  {
    "id": 40,
    "sentiment": "Traição",
    "author": "IA",
    "text": "Quando a confiança é quebrada, reconstruir uma relação exige responsabilidade, transparência e disposição para enfrentar as consequências das atitudes."
  },
  {
    "id": 41,
    "sentiment": "Saudade",
    "author": "IA",
    "text": "A saudade representa a ausência de alguém ou de algo que possui significado emocional, despertando lembranças e sentimentos de nostalgia."
  },
  {
    "id": 42,
    "sentiment": "Saudade",
    "author": "IA",
    "text": "Relembrar momentos especiais pode trazer conforto e tristeza simultaneamente, evidenciando a importância das experiências vividas."
  },
  {
    "id": 43,
    "sentiment": "Saudade",
    "author": "IA",
    "text": "A saudade conecta o presente ao passado, mantendo vivas as lembranças de pessoas, lugares e situações que marcaram nossa trajetória."
  },
  {
    "id": 44,
    "sentiment": "Saudade",
    "author": "IA",
    "text": "Sentir saudade é reconhecer que determinadas experiências deixaram marcas profundas e continuam fazendo parte de nossa história."
  },
  {
    "id": 45,
    "sentiment": "Paz",
    "author": "IA",
    "text": "A paz interior é caracterizada por uma sensação de equilíbrio emocional, tranquilidade e aceitação das circunstâncias presentes."
  },
  {
    "id": 46,
    "sentiment": "Paz",
    "author": "IA",
    "text": "Encontrar paz significa conseguir lidar com os desafios sem permitir que eles dominem completamente nossos pensamentos e emoções."
  },
  {
    "id": 47,
    "sentiment": "Paz",
    "author": "IA",
    "text": "Momentos de silêncio e reflexão podem contribuir para uma sensação de serenidade, permitindo que a mente desacelere."
  },
  {
    "id": 48,
    "sentiment": "Paz",
    "author": "IA",
    "text": "A paz não significa ausência de problemas, mas a possibilidade de enfrentá-los com equilíbrio e clareza."
  },
  {
    "id": 49,
    "sentiment": "Arrependimento",
    "author": "IA",
    "text": "O arrependimento surge quando percebemos que uma decisão tomada no passado não corresponde às nossas expectativas ou aos nossos valores atuais."
  },
  {
    "id": 50,
    "sentiment": "Arrependimento",
    "author": "IA",
    "text": "Pensar em oportunidades perdidas pode provocar arrependimento, especialmente quando imaginamos como nossas escolhas poderiam ter alterado determinados acontecimentos."
  },
  {
    "id": 51,
    "sentiment": "Arrependimento",
    "author": "IA",
    "text": "O arrependimento nos permite avaliar nossas atitudes e reconhecer que algumas decisões poderiam ter sido conduzidas de maneira diferente."
  },
  {
    "id": 52,
    "sentiment": "Arrependimento",
    "author": "IA",
    "text": "Embora não seja possível modificar o passado, o arrependimento pode influenciar nossas escolhas futuras e contribuir para o amadurecimento pessoal."
  },
  {
    "id": 53,
    "sentiment": "Tristeza",
    "author": "Humano",
    "text": "Precisei me afastar de uma amizade porque aquela relação estava me fazendo mal. Mesmo sendo difícil, entendi que precisava pensar no meu bem-estar."
  },
  {
    "id": 54,
    "sentiment": "Melancolia",
    "author": "Humano",
    "text": "Quando tive que me mudar de cidade mesmo querendo ficar. Foi triste deixar para trás pessoas, momentos e tudo aquilo com que eu já estava acostumada."
  },
  {
    "id": 55,
    "sentiment": "Tristeza",
    "author": "Humano",
    "text": "Às vezes, sinto que, por mais que eu me esforce na escola, nunca é suficiente. Isso me deixa triste, porque quero fazer o meu melhor, mas nem sempre reconheço minhas próprias conquistas."
  },
  {
    "id": 56,
    "sentiment": "Saudade",
    "author": "Humano",
    "text": "Sinto saudade da minha antiga escola, dos amigos, dos professores e dos momentos que vivi lá. Às vezes, gostaria de voltar no tempo para reviver um pouquinho daquela época."
  },
  {
    "id": 57,
    "sentiment": "Paz",
    "author": "Humano",
    "text": "Quando estou sentada em frente ao mar, e acabo lembrando de momentos felizes, dos quais eu sou agradecida, só consigo sentir uma leveza em meu coração."
  },
  {
    "id": 58,
    "sentiment": "Paz",
    "author": "Humano",
    "text": "Adoro estudar sobre as baleias, elas são animais tão incríveis, queria que cada pessoa pudesse conhecer um pouco sobre elas."
  },
  {
    "id": 59,
    "sentiment": "Paz",
    "author": "Humano",
    "text": "Em Imbituba tem uma trilha, ao final dela tem uma casa na árvore, meu sonho é conseguir ir lá na época das baleias, deve ser incrível"
  },
  {
    "id": 60,
    "sentiment": "Paz",
    "author": "Humano",
    "text": "Depois de um dia cansativo, gosto de chegar em casa, tomar um banho e ver série e filmes. Sinto uma tranquilidade muito boa por estar no meu cantinho."
  },
  {
    "id": 61,
    "sentiment": "Dúvida/incerteza",
    "author": "Humano",
    "text": "Já tive dúvidas sobre uma amizade, sem saber se aquela pessoa realmente gostava de mim. Fiquei pensando se deveria conversar com ela ou me afastar"
  },
  {
    "id": 62,
    "sentiment": "Dúvida/incerteza",
    "author": "Humano",
    "text": "Às vezes, fico em dúvida sobre qual profissão quero seguir no futuro. Tenho medo de escolher algo e depois descobrir que não era o que eu queria."
  },
  {
    "id": 63,
    "sentiment": "Dúvida/incerteza",
    "author": "Humano",
    "text": "Quando conheço alguém novo, às vezes fico em dúvida se posso confiar nessa pessoa.Mas acabo demorando e a pessoa vai embora, antes mesmo de confiar nela."
  },
  {
    "id": 64,
    "sentiment": "Dúvida/incerteza",
    "author": "Humano",
    "text": "Sempre que é preciso tomar uma decisões importantes, fico com medo de escolher errado.E sempre acabo desistindo antes mesmo de fazer"
  },
  {
    "id": 65,
    "sentiment": "Família",
    "author": "Humano",
    "text": "Um dia, durante uma briga de meus tios pequenos, minha vó rasgou o sofá do meio. Hoje, essa história nós trás muitas risadas quando falamos sobre o que aconteceu"
  },
  {
    "id": 66,
    "sentiment": "Família",
    "author": "Humano",
    "text": "Nos almoços em família, sempre tem a famosa lasanha da vovó, que é uma disputas pra ver quem come mais, um momento inesquecível que não tem quem não goste."
  },
  {
    "id": 67,
    "sentiment": "Família",
    "author": "Humano",
    "text": "Pelo menos uma vez ao ano vamos para Imbituba, a saudade é tanta que quando chegamos, ja está na hora de ir embora e a saudade vai ficando cada vez maior."
  },
  {
    "id": 68,
    "sentiment": "Família",
    "author": "Humano",
    "text": "Um dia fizemos uma surpresa para minha vó, aparecemos de surpresa em sua casa pra fazer uma festa do pijama, ao final da noite com toda a família reunida, fizemos um karaokê, nem preciso comentar sobre as vozes lindas."
  },
  {
    "id": 69,
    "sentiment": "Raiva",
    "author": "Humano",
    "text": "A falta de carácter em uma pessoa faz com que desperte o sentimento de raiva."
  },
  {
    "id": 70,
    "sentiment": "Felicidade",
    "author": "Humano",
    "text": "A felicidade pode estar nas coisas mais simples da vida."
  },
  {
    "id": 71,
    "sentiment": "Família",
    "author": "Humano",
    "text": "Família é o maior tesouro que Deus projetou para os seres humanos, é nela que encontramos o verdadeiro sentido do amor."
  },
  {
    "id": 72,
    "sentiment": "Saudade",
    "author": "Humano",
    "text": "Sinto saudades dos meus avós,dos conselhos recebidos, dos abraços apertados e do cheiro de amores espalhados."
  },
  {
    "id": 73,
    "sentiment": "Arrependimento",
    "author": "Humano",
    "text": "Não soube o que falar nos momentos certos"
  },
  {
    "id": 74,
    "sentiment": "Família",
    "author": "Humano",
    "text": "Almoçar na minha vó com a família toda reunida."
  },
  {
    "id": 75,
    "sentiment": "Melancolia",
    "author": "Humano",
    "text": "Esqueci de responder meu pai, e no dia seguinte ele faleceu."
  },
  {
    "id": 76,
    "sentiment": "Frustração",
    "author": "Humano",
    "text": "Fico frustado quando eu estudo muito para alguma prova e eu acabo tirando uma nota baixa"
  },
  {
    "id": 77,
    "sentiment": "Paz",
    "author": "Humano",
    "text": "Sinto paz quando eu posso ficar deitado no meu quarto fazendo nada o dia todo"
  },
  {
    "id": 78,
    "sentiment": "Felicidade",
    "author": "Humano",
    "text": "Sempre sinto felicidade quando estou me arrumando ou meu preparando para sair com os meus amigos para algum lugar legal"
  },
  {
    "id": 79,
    "sentiment": "Ansiedade",
    "author": "Humano",
    "text": "Estava passando por uma fase difícil e não conseguia parar de pensar nas coisas. Eu ficava imaginando tudo dando errado, tinha medo do futuro e me preocupava até com coisas pequenas."
  },
  {
    "id": 80,
    "sentiment": "Ansiedade",
    "author": "Humano",
    "text": "Por fora, tentava agir normalmente, mas, por dentro, parecia que minha cabeça não tinha descanso."
  },
  {
    "id": 81,
    "sentiment": "Ansiedade",
    "author": "Humano",
    "text": "Era cansativo guardar tudo para mim e fingir que estava bem, mesmo quando eu só queria que alguém percebesse que eu não estava."
  },
  {
    "id": 82,
    "sentiment": "Família",
    "author": "Humano",
    "text": "Fiz uma viagem com minha família e foi um dos momentos que mais gostei de viver com eles. Durante o caminho, a gente conversava, ria de coisas bobas e até discutia por besteira, como acontece em todas"
  },
  {
    "id": 83,
    "sentiment": "Saudade",
    "author": "Humano",
    "text": "Na hora, parecia só mais uma viagem em família, quando voltei para casa, percebi o quanto aqueles momentos foram especiais. Sinto saudade e fico olhando as fotos, lembrando das risadas e de como eu queria poder viver tudo aquilo de novo."
  },
  {
    "id": 84,
    "sentiment": "Arrependimento",
    "author": "Humano",
    "text": "Uma vez, acabei me afastando de uma pessoa importante por orgulho. Eu poderia ter pedido desculpas, conversado e tentado resolver as coisas, mas preferi ficar quieto, achando que o tempo resolveria tudo."
  },
  {
    "id": 85,
    "sentiment": "Raiva",
    "author": "Humano",
    "text": "Até hoje, às vezes, penso em como teria sido diferente se eu tivesse agido de outra forma. Aprendi que o orgulho pode fazer a gente perder pessoas que realmente importam e que nem sempre temos a chance de consertar tudo."
  },
  {
    "id": 86,
    "sentiment": "Raiva",
    "author": "Humano",
    "text": "Às vezes, a gente fala coisas no calor do momento e só percebe o quanto machucou o outro quando já é tarde."
  },
  {
    "id": 87,
    "sentiment": "Raiva",
    "author": "Humano",
    "text": "Na hora, estava tão irritado que falei coisas sem pensar, só porque estava com raiva. Depois, sozinho, comecei a pensar no que tinha acontecido e percebi que acabei magoando alguém que não queria perder."
  }
];

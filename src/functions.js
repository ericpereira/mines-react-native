//criar tabuleiro
const createBoard = (rows, columns) => {
    //rows: quantidade de elementos
    //fill(0): preencher com zero
    //.map((_, row)) o underline indica que está ignorando aquele argumento
    //o map recebe uma função de call back com os argumentos e (elemento), i (indice)
    return Array(rows).fill(0).map((_, row) => { //linhas da matriz
        return Array(columns).fill(0).map((_, column) => { //colunas
            return { //retorna um objeto
                row, //row: row
                column,
                opened: false,
                flagged: false,
                mined: false,
                exploded: false,
                nearMines: 0,
            }
        })
    })
}

//espalhar minas
//recebe o tabuleiro e a quantidade de minas
const spreadMines = (board, minesAmount) => {
    const rows = board.length
    const columns = board[0].length
    let minesPlanted = 0 //variavel

    while(minesPlanted < minesAmount){
        const rowSel = parseInt(Math.random() * rows, 10)
        const colSel = parseInt(Math.random() * columns, 10)

        //caso não esteja minado
        if(!board[rowSel][colSel].mined){
            board[rowSel][colSel].mined = true
            minesPlanted++
        }
    }
}

//criar tabuleiro com minas plantadas
const createMinedBoard = (rows, columns, minesAmount) => {
    const board = createBoard(rows, columns)
    spreadMines(board, minesAmount)
    return board
}

//clona um tabuleiro, board: tabuleiro, retorna um tabuleiro clonado
const cloneBoard = board => {
    return board.map(rows => { //para todas as linhas
        return rows.map(field => { //para todos os campos na linha (coluna)
            return { ...field} //retorna o campo com o operador spread
        })
    })
}

//pega os vizinhos
const getNeighbors = (board, row, column) => {
    const neighbors = []
    const rows = [row - 1, row, row + 1] //linhas vizinhas
    const columns = [column - 1, column, column + 1]

    rows.forEach(r => {
        columns.forEach(c => {
            const diferent = r !== row || c !== column
            const validRow = r >= 0 && r < board.length
            const validColumn = c >= 0 && c < board[0].length

            if(diferent && validRow && validColumn){
                neighbors.push(board[r][c]) //adiciona o vizinho no array de vizinhos
            }
        })
    })

    return neighbors
}

//método para verificar se a vizinhança é segura
const safeNeighborhood = (board, row, column) => {
    //result = totalizador, neighbor = vizinho atual
    const safes = (result, neighbor) => result && !neighbor.mined

    return getNeighbors(board, row, column).reduce(safes, true)
}

//abrir campo
const openField = (board, row, column) => {
    const field = board[row][column]
    
    if(!field.opened){
        field.opened = true

        if(field.mined){
            field.exploded = true
        }else if(safeNeighborhood(board, row, column)){
            //caso seja um vizinhança segura, chama o openfield para abrir cada um dos vizinhos
            getNeighbors(board, row, column).forEach(n => openField(board, n.row, n.column))
        }else{ //caso não seja segura, calcula quantas minas tem ao redor
            const neighbors = getNeighbors(board, row, column)
            
            field.nearMines = neighbors.filter(n => n.mined).length //aplica o filtro e calcula o tamnho do vetor retornado
        }
    }
}

//pega todos os fields como se fosse um grande array
const fields = board => [].concat(...board)

//verifica se tem algum campo explodido
const hadExplosion = board => fields(board).filter(field => field.exploded).length > 0

//verifica se um campo é pendente
const pendding = field => (field.mined && !field.flagged)
     || (!field.mined && !field.opened)

//verifica se o usuario ganhou o jogo
const wonGame = board => fields(board).filter(pendding).length === 0

//exibe as minas após o usuário perder o jogo
const showMines = board => fields(board).filter(field => field.mined)
    .forEach(field => field.opened = true)

//marcar a bandeira
const invertFlag = (board, row, column) => {
    const field = board[row][column]
    field.flagged = !field.flagged
}

//flags usadas no jogo
const flagsUsed = board => fields(board)
    .filter(field => field.flagged).length

//exporta os métodos
export { 
    createMinedBoard,
    cloneBoard,
    openField,
    hadExplosion,
    wonGame,
    showMines,
    invertFlag,
    flagsUsed,
}
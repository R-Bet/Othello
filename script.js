//Globals

var board =
    [
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', 'x', 'o', ' ', ' ', ' '],
        [' ', ' ', ' ', 'o', 'x', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']
    ];

var Offsets =
    [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [1, 1],
        [-1, 1],
        [1, -1],
        [-1, -1],
    ]

var turn = 0;

function InitializeTable() {
    let table = document.getElementById("gametable");
    for (let i = 0; i < board.length; i++) {
        let tr = document.createElement("tr");
        for (let j = 0; j < board[i].length; j++) {
            let td = document.createElement("td");
            let a = document.createElement("a");
            let s = document.createElement("span");

            a.className = "playanchor"
            s.className = "playpiece";
            s.id = "playpiece" + i + j;

            a.appendChild(s)
            td.appendChild(a);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }

    RefreshTable();
    MarkUsable();
}

function RefreshTable() {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            let playpiece = document.getElementById('playpiece' + i + j);
            playpiece.style = "background-color: " + ColorByPiece(board[i][j]);
            playpiece.parentElement.setAttribute("onclick", `Erm();`);
        }
    }

    if (BoardFull()) {
        alert(WhoWon());
    }

    document.getElementById('playpiece99').style = 'background-color: ' + ColorByPiece(GetPlayer());

    if (!MarkUsable()) {
        alert(WhoWon());
    }
}

function Erm() { } //does nothing i just don't want an error :)

function RestartGame() {
    board =
        [
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', 'x', 'o', ' ', ' ', ' '],
            [' ', ' ', ' ', 'o', 'x', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']
        ];
    turn = 0;
    RefreshTable();
    MarkUsable();
}


function MarkUsable() {
    let AnyUsable = false;
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (MarkUsableAround(i, j))
                AnyUsable = true;
        }
    }
    return AnyUsable;
}

function MarkUsableAround(i, j) {
    let AnyUsable = false;
    if (board[i][j] == GetNotPlayer()) {
        for (let x = 0; x < Offsets.length; x++) {
            o = Offsets[x];
            if (IsUsable(i + o[0], j + o[1], -o[0], -o[1])) {
                let playpiece = document.getElementById('playpiece' + (i + o[0]) + (j + o[1]));
                playpiece.style = "background-color:gray;";
                playpiece.parentElement.setAttribute("onclick", `ClickPiece(${i + o[0]}, ${j + o[1]});`);
                AnyUsable = true;
            }
        }
    }
    return AnyUsable;
}

function IsUsable(InitialI, InitialJ, OffsetI, OffsetJ) {
    if (!Inbounds(InitialI, InitialJ)) return;
    if (board[InitialI][InitialJ] != ' ') return;
    let i = InitialI + OffsetI;
    let j = InitialJ + OffsetJ;

    while (Inbounds(i, j)) {
        if (board[i][j] == ' ')
            return false;

        if (board[i][j] == GetPlayer())
            break;

        i += OffsetI;
        j += OffsetJ;
    }

    if (!Inbounds(i, j))
        return false;

    return true;
}

function WhoWon() {
    let x = 0;
    let o = 0;
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] == 'x')
                x++;
            if (board[i][j] == 'o')
                o++;
        }
    }

    if (x == o) return 'Draw!';
    return `${x > o ? 'x' : 'o'} Won!`;
}

function BoardFull() {
    return (board.every((l) => l.every((c) => c != ' ')))
}

function ColorByPiece(c) {
    if (c == ' ')
        return '#33363b';
    if (c == 'x')
        return '#546bff';
    if (c == 'o')
        return '#bd0000';
    return '#33363b'
}

function ClickPiece(i, j) {
    if (board[i][j] != ' ') return;

    board[i][j] = GetPlayer();

    TurnUp(i, j);

    turn = turn == 0 ? 1 : 0;

    MarkAvailable();

    RefreshTable();
}

function TurnUp(i, j) {
    current = board[i][j];

    player = GetPlayer();
    notplayer = player == 'x' ? 'o' : 'x';

    CheckAndFillAll(player, i, j);
}

function CheckAndFillAll(player, i, j) {
    for (let x = 0; x < Offsets.length; x++) {
        CheckAndFill(player, i, j, Offsets[x][0], Offsets[x][1]);
    }
}

function Inbounds(i, j) {
    if (i < 0 || i >= board.length)
        return false;
    if (j < 0 || j >= board[0].length)
        return false;
    return true;
}

function MarkAvailable() {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (SquareViable(GetPlayer(), i, j))
                document.getElementById('playpiece' + i + j).parentElement.parentElement.style = "border: 2px solid green;";
        }
    }
}

function SquareViable(player, InitialI, InitialJ) {
    return board[InitialI, InitialJ] == player;
}

function CheckAndFill(player, InitialI, InitialJ, OffsetI, OffsetJ) {
    let i = InitialI + OffsetI;
    let j = InitialJ + OffsetJ;

    while (Inbounds(i, j)) {
        if (board[i][j] == ' ')
            return;

        if (board[i][j] == player)
            break;

        i += OffsetI;
        j += OffsetJ;
    }

    if (!Inbounds(i, j))
        return;

    i = InitialI + OffsetI;
    j = InitialJ + OffsetJ;

    while (Inbounds(i, j) && board[i][j] != player) {
        board[i][j] = player;

        i += OffsetI;
        j += OffsetJ;
    }
    return;
}

function GetPlayer() {
    if (turn == 1) return 'o';
    return 'x';
}

function GetNotPlayer() {
    if (turn == 0) return 'o';
    return 'x';
}


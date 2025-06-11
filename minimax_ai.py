EMPTY = "-"
PLAYER_X = "X"
PLAYER_O = "O"

def check_winner(board):
    wins = [(0,1,2),(3,4,5),(6,7,8),
            (0,3,6),(1,4,7),(2,5,8),
            (0,4,8),(2,4,6)]
    for a,b,c in wins:
        if board[a] != EMPTY and board[a] == board[b] == board[c]:
            return board[a]
    return None

def is_terminal(board):
    return check_winner(board) is not None or EMPTY not in board

def minimax(board, is_maximizing):
    winner = check_winner(board)
    if winner == PLAYER_O:
        return 1, None
    elif winner == PLAYER_X:
        return -1, None
    elif EMPTY not in board:
        return 0, None

    best_score = float('-inf') if is_maximizing else float('inf')
    best_move = None

    for i in range(9):
        if board[i] == EMPTY:
            board[i] = PLAYER_O if is_maximizing else PLAYER_X
            score, _ = minimax(board, not is_maximizing)
            board[i] = EMPTY

            if is_maximizing:
                if score > best_score:
                    best_score = score
                    best_move = i
            else:
                if score < best_score:
                    best_score = score
                    best_move = i

    return best_score, best_move

def best_move_minimax(state_str):
    board = list(state_str)
    _, move = minimax(board, is_maximizing=True)
    return move

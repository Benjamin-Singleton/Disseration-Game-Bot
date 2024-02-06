const playerOneDisc = '🔴';
const playerTwoDisc = '🟡';

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('connectfour')
		.setDescription('Starts a connect four game for the user.')
        .addUserOption(option => option.setName('opponent').setDescription('The user you would like to be your opponent')),
	async execute(interaction) {
        const game = {
            board: intializeBoard(),
            rows: 6,
            columns: 7,
            currentPlayer: 1,
        };

        const gameEmbed = constructEmbed(game, interaction);
        await interaction.reply ('How to play: When it is your turn, click the reaction with the number on which column you would like to place a piece!')
        let message = await interaction.followUp({ embeds: [gameEmbed], fetchReply: true });
        try {
        await message.react('1️⃣')
        .then(() => message.react('2️⃣'))
        .then(() => message.react('3️⃣'))
        .then(() => message.react('4️⃣'))
        .then(() => message.react('5️⃣'))
        .then(() => message.react('6️⃣'))
        .then(() => message.react('7️⃣'))
        .then(() => {
            const collectorFilter = (reaction, user) => {
                return ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣'].includes(reaction.emoji.name) && user.id === message.author.id;
                //return reaction.emoji.name === '1️⃣' && user.id == interaction.user.id;
            };

            message.awaitReactions({ collectorFilter, max: 1, time: 15000, errors: ['time'] })
                .then(collected => {
                    console.log('reaction collected');
                    const reaction = collected.first();

                    if (reaction.emoji.name === '1️⃣') {
                        handlePlayerMove(interaction, game, '1')
                    } else if (reaction.emoji.name === '2️⃣') {
                        message.reply('You reacted with a 2.');
                    } else if (reaction.emoji.name === '3️⃣') {
                        message.reply('You reacted with a 3.');
                    } else if (reaction.emoji.name === '4️⃣') {
                        message.reply('You reacted with a 4.');
                    } else if (reaction.emoji.name === '5️⃣') {
                        message.reply('You reacted with a 5.');
                    } else if (reaction.emoji.name === '6️⃣') {
                        message.reply('You reacted with a 6.');
                    } else if (reaction.emoji.name === '7️⃣') {
                        message.reply('You reacted with a 7.');
                    }
                })
                .catch(collected => {
                    message.reply('You must react with one of the provided numbers, between 1 and 7.');
                });
        }
        );
;
        } catch (error) {
            console.error('One of the emojis failed to react:', error);
        }

        
	},
};

async function outputEmbed(interaction, gameEmbed) {
    let message = await interaction.followUp({ embeds: [gameEmbed], fetchReply: true });
        try {
        await message.react('1️⃣')
        .then(() => message.react('2️⃣'))
        .then(() => message.react('3️⃣'))
        .then(() => message.react('4️⃣'))
        .then(() => message.react('5️⃣'))
        .then(() => message.react('6️⃣'))
        .then(() => message.react('7️⃣'))
    } catch (error) {
        console.error('One of the emojis failed to react:', error);
    }

}

function constructEmbed(game, interaction) {
    if (game.currentPlayer == 1) {
        const gameEmbed = new EmbedBuilder()
        .setTitle('Connect Four')
        .setDescription(`${displayBoard(game.board)}`)
        .setAuthor({ name: 'gamebot', iconURL: interaction.user.displayAvatarURL() })
        return gameEmbed;
    } else {
        const gameEmbed = new EmbedBuilder()
        .setTitle('Connect Four')
        .setDescription(`${displayBoard(game.board)}`)
        .setAuthor({ name: 'gamebot', iconURL: interaction.option.user.displayAvatarURL() })
        return gameEmbed;
    }
    
}

function intializeBoard() {
    const board = [
        ["⚪", "⚪", "⚪", "⚪", "⚪", "⚪", "⚪"],
        ["⚪", "⚪", "⚪", "⚪", "⚪", "⚪", "⚪"],
        ["⚪", "⚪", "⚪", "⚪", "⚪", "⚪", "⚪"],
        ["⚪", "⚪", "⚪", "⚪", "⚪", "⚪", "⚪"],
        ["⚪", "⚪", "⚪", "⚪", "⚪", "⚪", "⚪"],
        ["⚪", "⚪", "⚪", "⚪", "⚪", "⚪", "⚪"],
    ];
    return board;
}

// Display current game board
function displayBoard(board) {
    const boardStr = board.map(row => row.join('')).join('\n');
    return boardStr;
}

// Check for winning condition (four in a row)
async function checkWin(interaction, game) {
    // Horizontally
    for (let r = 0; r < game.rows; r++) {
        for (let c = 0; c < game.columns - 3; c++) {
            if (game.board[r][c] != '⚪') {
                if (board[r][c] == game.board[r][c+1] && game.board[r][c+1] == game.board[r][c+2] && game.board[r][c+2] == game.board[r][c+3]) {
                    setWinner(interaction, game.board, r, c);
                }
            }
        }
    }
    // Vertically
    for (let c = 0; c < game.columns; c++) {
        for (let r = 0; r < game.rows - 3; r++) {
            if (game.board[r][c] == game.board[r+1][c] && game.board[r+1][c] == game.board[r+2][c] && game.board[r+2][c] == game.board[r+3][c]) {
                setWinner(interaction, game.board, r, c);
            }
        }
    }
    // Anti diagonally
    for (let r = 0; r < game.rows - 3; r++) {
        for (let c = 0; c < game.columns - 3; c++) {
            if (game.board[r][c] != '⚪') {
                if (game.board[r][c] == game.board[r+1][c+1] && game.board[r+1][c+1] == game.board[r+2][c+2] && game.board[r+2][c+2] == game.board[r+3][c+3]) {
                    setWinner(interaction, game.board, r, c);
                }
            }
        }
    }
    // Diagonally
    for (let r = 0; r < game.rows; r++) {
        for (let c = 0; c < game.columns - 3; c++) {
            if (game.board[r][c] != '⚪') {
                if (game.board[r][c] == game.board[r-1][c+1] && game.board[r-1][c+1] == game.board[r-2][c+2] && game.board[r-2][c+2] == game.board[r-3][c+3]) {
                    setWinner(interaction, game.board, r, c);
                }
            }
        }
    }
}

async function setWinner(interaction, board, r, c) {
    if (board[r][c] == '🔴') { 
        await interaction.reply(`The winner is ${interaction.user.username}!`)
    // } else {
    //     await interaction.reply(`The winner is ${interaction.option.user.username}`)
    // }
}
}


async function handlePlayerMove(interaction, game, chosenColumn) {
    const currentPlayerDisc = game.currentPlayer === 1 ? playerOneDisc : playerTwoDisc;
    for (let r = 0; r < game.rows - 1 ; r++) {
            if (game.board[r+1][chosenColumn] == '🔴' || game.board[r+1][chosenColumn] == '🟡') {
                game.board[r][chosenColumn] = currentPlayerDisc;
            }
        }
    checkWin(interaction, game);
    let newGameEmbed = constructEmbed(game, interaction);
    game.currentPlayer = game.currentPlayer === 1 ? 2 : 1;
    outputEmbed(interaction, newGameEmbed);
    }


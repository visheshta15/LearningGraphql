import { ApolloServer } from "@apollo/server"; 
import { startStandaloneServer } from '@apollo/server/standalone';  

//db
import db from './_db.js'

// types
import { typeDefs } from "./schema.js";

const resolvers = {
    Query: {
        games() {
            return db.games
        },
        reviews(){
            return db.reviews
        },
        authors(){
            return db.authors
        },
        game(_, args){
            // console.log('11', db.games.find((game)=> game.id === args.id))
            return db.games.find((game) => game.id === args.id)
        },
        review(_, args){
            return db.reviews.find((review) => review.id === args.id)
        },
        author(_, args){
            return db.authors.find((author) => author.name === args.name)
        },
    },
    // related data
    Game: {
        reviews(parent) {
            console.log('22--', parent)
            return db.reviews.filter((review) => review.game_id === parent.id )
        }
    },
    Author: {
        reviews(parent) {
            console.log('33--', parent)
            return db.reviews.filter((review) => review.author_id === parent.id )

        }
    },
    Review: {
        game(parent) {
            return db.games.find((game) => game.id === parent.game_id )
        },
        author(parent) {
            return db.authors.find((author) => author.id === parent.author_id )
        }
    },
    Mutation: {
        deleteGame(_, args){
           db.games =  db.games.filter((g) => g.id !== args.id)
           return db.games
        },
        addGame(_, args){
            let game = {
                ...args.game,
                id : Math.floor(Math.random() * 100).toString()
            }
            db.games.push(game)
            return game
        },
        updateGame(_, args){
            db.games = db.games.map((game) => {
                if(game.id === args.id){
                    return {...game, ...args.edits}
                }
                return game
            })

            console.log('1a--', args)
            console.log('1b--', db.games)
            return db.games.find((g) => g.id === args.id)
        }
    }
}

//server setUP
const server = new ApolloServer({
    typeDefs,
    resolvers
})

// start a server with startStandaloneServer
const { url } = await startStandaloneServer(server, {
    listen: { port : 4000}
})

console.log('Server ready at port', url)
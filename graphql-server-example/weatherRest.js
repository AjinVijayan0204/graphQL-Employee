// import { ApolloServer } from '@apollo/server';
// import { expressMiddleware } from '@apollo/server/express4';
// import cors from 'cors';
// import { bodyParser } from 'body-parser';
// import express from 'express';

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import axios from 'axios'



const typeDefs = `#graphql

	type Query {

		city: [City]

		cityByName(name: String): City

	}

	type city {

		id: ID!

		name: String

		country: String

		weather: Weather

	}

	type Weather{

		temp: Float,

		feels like: Float, 

		temp_max: Float, 

		pressure: Int, 

		humidity: Int,

		temp_min: Float,

		sea level: Int, 
		
		grnd_level: Int,

		temp_c: Float

	}
`;

const cityArray = [
	{

		id: 1,

		name: "Pathanamthitta", 

		country: "India" 
	},

	{
		id: 2,

		name: "Palakkad", 

		country: "India"
	},

	{

		id: 3, 
	
		name: "Mysore", 
	
		country: "India"
	
	},

	{ 
	
		id: 4, 
	
		name: "Dubai",
		
		country: "UAE" 
	
	},

	{ 
	
		id: 5, 
	
		name: "Mumbai", 
	
		country: "India" 
	
	}, 
	
	{

		id: 6,

		name: "Delhi",

		country: "India"

	},

];



const resolvers = { 

	Query: {

		city: () => cityArray,

		cityByName(parent, args, context, info){ 
			return cityArray.find((cityArray)=>cityArray.name===args.name);

		}
	}, 
	
	City:{
		weather: (parent, args, contextual, info)=>{ 
		let url1 = "https://api.openweathermap.org/data/2.5/weather?q=" 
		let url3 = "&appid=ab495d1cffc996e57a31a0c84d1bf0ae"
		let url2 = parent.name
		let url = url1+url2+url3
		//console.log(parent.name)
		//console.log(url)
		return axios
			.get(url)
			.then((response)=>{
				return response.data.main
				});
			}
		},

	Weather:{

		temp_c: (parent, args, contextual, info) => Math.round((parent.temp - 273.15)*100.0)/100.0,
	}
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
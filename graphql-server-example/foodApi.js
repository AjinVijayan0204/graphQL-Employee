import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

//const typeDefs = gql`

const typeDefs = `#graphql

	type Food{

		id: ID!
		name: String
		veg: Boolean
		cost: String
		imgUrl: String
	
	}
	
	type Vendor{
		vendorId: ID!
		name: String
		foodCourtNo: String
		foodCourtName: String
		password: String
	}
	
	type FoodForToday{
		dataId: ID!
		vendorId: ID!
		foods: [Food]
	}
	
	type Query{
	
		foods: [Food]
		foodByName(name:String): Food
		foodById(id:ID!): Food
		foodForTodayByVendor(vendorId: String): [Food]
		vendors: [Vendor]
		foodForToday: [FoodForToday]
	}
	
	type Mutation{
		addFood(name:String, veg:Boolean): Food
		addFoodWithImage(name:String, veg:Boolean, imgUrl:String): [Food]
		updateFood(name:String,veg:Boolean,imgUrl:String):[Food]
		removeFood(name:String, veg:Boolean):[Food]
		
		addVendor(name: String, password:String, foodCourtNo:String, foodCourtName:String): Boolean
		addFoodForToday(vendorId:ID!, foodId: ID!): [FoodForToday]
		
	}
`;

var foodArray = [

	{
		id: 1,
		name: "Dosa",
		veg: true,
		cost: "6.0",
		imgUrl: "https://image.shutterstock.com/image-photo/south-indian-food-crispy-masala-260nw-2135616403.jpg"
	},
	
	{
		id: 2,
		name: "Idly",
		veg: true,
		cost: "5.0",
		imgUrl: "https://image.shutterstock.com/image-photo/idly-idli-south-indian-main-260nw-1932835511.jpg"
	},
	
	{
		id: 3,
		name: "Biriyani",
		veg: false,
		cost: "120.0",
		imgUrl: "https://image.shutterstock.com/image-photo/chicken-dhum-biriyani-using-jeera-260nw-2047827035.jpg"
	}
	
];

var foodForTodayArray = [
];

var vendorArray = [
];

const resolvers = {
	
	Query: {
	
		foods(){
			return foodArray;
		},
		
		foodByName(parent,args,context,info){
			return foodArray.find((foodArray)=>foodArray.name===args.name)
		},
		foodById(parent,args,context,info){
			return foodArray.find((foodArray)=>foodArray.id == args.id);
		},
		vendors(){
			return vendorArray;
		},
		foodForToday(){
			return foodForTodayArray;
		}
	},
	
	Mutation: {
		addFood(parent, args, context, info){
			const food = {
				id: foodArray.length+1,
				name: args.name,
				vegs: args.veg,
				cost: args.cost,
				imgUrl: ""
			};
			foodArray.push(food);
			foodArray.sort((a,b)=>{
				return a.id - b.id;
			})
			return food;
		},
		
		addFoodWithImage(parent, args, context, info){
			const food ={
				id: foodArray.length+1,
				name:args.name,
				veg:args.veg,
				cost: args.cost,
				imgUrl: args.imgUrl
			};
			foodArray.push(food);
			foodArray.sort((a,b)=>{
				return a.id - b.id;
			})
			return foodArray;
		},
		
		removeFood(parent, args, context, info){
		foodArray = foodArray.filter((foodArray)=>foodArray.id!==args.id);
		return foodArray;
		},
		
		updateFood(parent, args, context, info){
		var food = foodArray.filter((foodArray)=>foodArray.id!==args.id);
		var temp;
		for(temp of food){}
		var newFood = {
			id: temp.id,
			name: temp.name,
			veg: args.veg,
			cost: args.cost,
			imgUrl: args.imgUrl
			};
		foodArray = foodArray.filter((foodArray)=>foodArray.name!==args.name);
		foodArray.push(newFood);
		foodArray.sort((a,b)=>{
				return a.id - b.id;
		})
		return foodArray;
		},
		
		addVendor(parent, args, context, info){
			const vendor = {
				vendorId: vendorArray.length+1,
				name: args.name,
				foodCourtNo: args.foodCourtNo,
				foodCourtName: args.foodCourtName,
				password: args.password
			};
			
			var foodForToday ={
				dataId: foodForTodayArray.length+1,
				vendorId: vendor.vendorId,
				foods: []
			};
			vendorArray.push(vendor);
			foodForTodayArray.push(foodForToday);
			vendorArray.sort((a,b)=>{
				return a.id - b.id;
			});
			return true;
		},
		
		addFoodForToday(parent, args, context, info){
			var foodForToday = foodForTodayArray.filter((foodForTodayArray)=>foodForTodayArray.vendorId == args.vendorId)[0];
			
			var food = foodArray.find((foodArray)=>foodArray.id == args.foodId);
			
			var temp = foodForToday.foods;
			temp.push(food);
			
			// var newFoodForToday = {
// 				dataId: foodForToday[0].dataId,
// 				vendorId: foodForToday[0].vendorId,
// 				foods: temp
// 			};
// 			foodForTodayArray.push(newFoodForToday);
// 			console.log(foodForTodayArray);
			return foodForTodayArray;
		},
	},
	
	
	
};


const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
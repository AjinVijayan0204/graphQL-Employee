//const { ApolloServer, gq1 } require('apollo-server');
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

//const typeDefs = gql`

const typeDefs = `#graphql
# Comments in GraphQL strings start with the hash (#) symbol.

# This "Employee" type defines the queryable fields for every employee present in our data source.

	type Employee {

		id: ID!

		firstName: String

		lastName: String

		companyId: String

		company: Company

		jobLevel: Int

		fullName: String

	}

	type Company{

		id: ID!

		name: String

		Location: String

		employees: [Employee]
	}
	
	# The "Query" type is special: it lists all of the available queries that # clients can execute, along with the return type for each.

	# In this case, the "employees" query returns an array of zero or more Employees (defined above).
	

	type Query {
	
		employees: [Employee]

		companies: [Company]

		companyByName(name: String): Company
		
		employeeByName(name: String): Employee
	}

		

	type Mutation{

		addEmployee (firstName: String, lastName: String, jobLevel: Int, companyId:String): Employee
		addCompany (name: String, Location: String): Company
		removeEmployee (firstName: String, lastName: String): [Employee] 
		updateEmployeeJob (firstName: String, lastName: String, jobLevel: Int): Employee
		updateEmployeeCompany (firstName: String, lastName: String, companyId:String): Employee
	}
	
`;
	

var employeeArray = [
	{

		id: "E1000",

		firstName: "James",

		lastName: "Ulrich",

	 	companyId: "C2",

		jobLevel: 4,

	},

	{

		id: "E1001",

		firstName: "Robert",

		lastName: "Hetfield",

		companyId: "C2",

		jobLevel: 3,

	},
	
	{

		id: "E1003",

		firstName: "Thomas",

		lastName: "Muller",

		companyId: "C1",

		jobLevel: 2,
	},
	
	{

		id: "E1004",

		firstName: "Harris",

		lastName: "Ram",

		companyId: "C3", 

		JobLevel: 5,

	},
	
	{
		id: "E1005",

		firstName: "Mathew",

		lastName: "Maguire",

		companyId: "C2",

		jobLevel: 3,
	},

	{
		id: "E1006",

		firstName: "George",
		
		lastName: "Little",

		companyId: "C3",

		jobLevel: 2,
	},
];

var companyArray = [

	{

		id: "C1",

		name: "Fabrica",

		Location: "NYC"

	},
	
	{

		id: "C2", 
		name: "Meteor", 
		Location: "LON"

	}, 
	
	{

		id: "C3", 
		name: "Yummy", 
		Location: "IND"
	},

];

const resolvers = {

	Query: {

		employees(){

			return employeeArray;

		},

		companies(){

			return companyArray;

		},

		companyByName(parent, args, context, info){

			return companyArray.find((companyArray)=>companyArray.name === args.name);

		},

		employeeByName (parent, args, context, info){

			return employeeArray.find((employeeArray)=>employeeArray.firstName === args.name);

		},

	},
	
	Mutation: {

		addEmployee (parent, args, context, info){

			const emp = { 
				id: employeeArray.length+1, 
				firstName: args.firstName, 
				lastName: args.lastName, 
				companyId:args.companyId, 
				jobLevel: args.jobLevel

			};

			employeeArray.push(emp);

			return emp;
		},
		
		addCompany (parent, args, context, info){

			const comp = {
				id: companyArray.length+1,
				name: args.name, 
				Location: args.Location

			};

			companyArray.push(comp);

			return comp;

		}, 
		
		removeEmployee (parent, args, context, info){

			employeeArray = employeeArray.filter((employeeArray) => employeeArray.firstName !== args.firstName && employeeArray.lastName!== args.lastName);

			return employeeArray;

		},

		updateEmployeeJob (parent, args, context, info){ 
			var emp = employeeArray.filter((employeeArray) => employeeArray.firstName=== args.firstName && employeeArray.lastName=== args.lastName);

			var temp;

			for (temp of emp){}

			var newEmp = {

				id: temp.id,

				firstName: temp.firstName,

				lastName: temp.lastName,

				companyId:temp.companyId,

				jobLevel: args.jobLevel

			};

			employeeArray = employeeArray.filter((employeeArray) => employeeArray.firstName!==args.firstName && employeeArray.lastName!== args.lastName); 
			employeeArray.push(newEmp);

			return newEmp;
		},
		
		updateEmployeeCompany (parent, args, context, info){
			var emp = employeeArray.filter((employeeArray) => employeeArray.firstName=== args.firstName && employeeArray.lastName-args.lastName); 
			var temp;
			for(temp of emp){} 
			var newEmp = { 
				id: temp.id,
				firstName: temp.firstName,
				lastName: temp.lastName, 
				companyId:args.companyId,
				jobLevel:temp.jobLevel

			};
			employeeArray = employeeArray.filter((employeeArray) => employeeArray.firstName!==args.firstName && employeeArray.lastName!==args.lastName); 
			employeeArray.push(newEmp);

			return newEmp;

		}
	},
	
	Employee: {

		fullName: (parent, args, contextual, info) => parent.firstName + " " + parent.lastName, 
		company (parent) {

			return companyArray.find((Company)=>Company.id===parent.companyId)

		}
	},

	Company: {

		employees (parent) {

			return employeeArray.filter((employeeArray)=>employeeArray.companyId===parent.id)

		}

	}

};

// The ApolloServer constructor requires two parameters: your schema 
// definition and your set of resolvers. 
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);


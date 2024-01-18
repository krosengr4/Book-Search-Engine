// import in User Schema
const { User } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthentificationError } = require('@apollo/server');

// Our queries / mutations we can make in graphQL
const resolvers = {

    // Queries
    Query: {

        // Query to find all users
        users: async () => {
            return User.find();
        },

        // Query to find a specific user
        user: async (parent, {userId}) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                console.log("USER DATA: ", userData)
                return userData;
            }
            throw new AuthentificationError('You need to be logged in');
        },
    },

    // Mutations
    Mutation: {

        // Mutation to addUser
        addUser: async (parent, {username, email, password }) => {
            const user = await User.create({ name, email, password });
            const token = signToken(user);

            return { token, user };
        },

        // Mutation to login
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            const correctPW = await user.isCorrectPassword(password);

            if (!correctPW) {
                throw new AuthentificationError('Wrong username or password');
            }

          const token = signToken(user);
          return { token, user }
        },

        // Mutation to a save book
        saveBook: async (parent, context, { authors, description, bookId, image, link, title}) => {
            if(context.user) {
                const user = await findOneAndUpdate(
                    {_id: context.user._id},
                    {
                        $addToSet: {
                            savedBooks: {
                                authors, description: description ? description : 'No description', bookId, image, link, title
                            }
                        }
                    }
                );

                return user;
            }
            throw new AuthentificationError('You need to be logged in to save books!');
        },

        // Mutation to a remove book
        removeBook: async(parent, context, { bookId }) => {
            if(context.user) {
                const user = await User.findOneAndUpdate(
                    { _id: context.user.id },
                    { $pull: { savedBooks: { bookId }}},
                    { new: true}
                );

                return user;
            }
            throw new AuthentificationError(' You must be logged in to remove a book!');
        },
    },
};

// export resolvers
module.exports = resolvers;
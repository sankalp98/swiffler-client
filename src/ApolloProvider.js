import React from 'react'
import App from './App'
import { ApolloClient } from '@apollo/client'
import { InMemoryCache} from '@apollo/client'
import { createHttpLink } from '@apollo/client'
import { ApolloProvider } from '@apollo/client'
import { setContext } from 'apollo-link-context'

const httpLink = createHttpLink({
    uri: 'https://lit-springs-76899.herokuapp.com/'
})

const authLink = setContext((request, previousContext) => {
    const token = localStorage.getItem('jwtToken')

    return {
        headers: {
            Authorization: token ? `Bearer ${token}` : ''
        }
    }
  })

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

export default (
    <ApolloProvider client={client}>
        <App/>
    </ApolloProvider>
)
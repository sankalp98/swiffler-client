import React from 'react'
import { useState, useContext } from 'react'
import { Button, Form } from 'semantic-ui-react'
import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'

import { AuthContext } from '../context/auth'

import { useForm } from '../util/hooks'

function Login(props) {
    const context = useContext(AuthContext)
    const [errors, setErrors] = useState({})

    const initialState = {
        username: '',
        password: '',
    }

    const { onChange, onSubmit, values } = useForm(loginUserCallback, initialState)

    const [loginUser, { loading }] = useMutation(LOGIN_USER, {
        update(proxy, result){
            context.login(result.data.login)
            console.log(result.data.login)
            props.history.push('/')
        },
        onError(err) {
            context.login('some error')
            setErrors(err.graphQLErrors[0].extensions.exception.errors);
          //setErrors('gg');
        },
        variables: values
      });

    function loginUserCallback(){
        loginUser();
    }

    return (
        <div class="form-container">
            <Form onSubmit={onSubmit} noValidate className={loading ? 'loading': ''}>
                <h1>LogIn</h1>
                <Form.Input
                    label="Username"
                    placeholder="Username..."
                    name = "username"
                    type="text"
                    value={values.username}
                    error={errors.username? true: false}
                    onChange={onChange}
                />
                <Form.Input
                    label="Password"
                    placeholder="Password..."
                    name = "password"
                    type="password"
                    value={values.password}
                    error={errors.password? true: false}
                    onChange={onChange}
                />
                <Button type="submit" primary>LogIn</Button>
            </Form>
            {Object.keys(errors).length>0 && (
                <div className="ui error message">
                    <ul className="list">
                        {Object.values(errors).map(value => (
                            <li key={value}>{value}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

const LOGIN_USER = gql`
    mutation login(
        $username: String!,
        $password: String!,
    ){
        login(logInInput : {
            username: $username
            password: $password
        }){
            id
            email
            username
            createdAt
            token
        }
    }
`
export default Login;
import React from 'react'

import { Form, Button } from 'semantic-ui-react'
import { useForm } from '../util/hooks'
import gql from 'graphql-tag'
import {useMutation} from '@apollo/client'
import {FETCH_POSTS_QUERY} from '../util/graphql'

function PostForm() {
    const initialState = {
        body: '',
    }

    const { onChange, onSubmit, values } = useForm(createPostCallBack, initialState)

    const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
        variables: values,
        update(proxy, result){
            const data = proxy.readQuery({
              query: FETCH_POSTS_QUERY
            })
            const newData = {
              getPosts: [result.data.createPost, ...data.getPosts]
            }

            //data.getPosts = [result.data.createPost, ...data.getPosts]
            //proxy.writeQuery({ query: FETCH_POSTS_QUERY, newData})
            proxy.writeQuery({
              query: FETCH_POSTS_QUERY,
              data: {
                ...data,
                getPosts: {
                  newData,
                },
              },
            });
            values.body = ''
        },
        onError(err){
            console.log(err)
        }
      });

    function createPostCallBack(){
        createPost();
    }

    return (
        <>
          <Form onSubmit={onSubmit}>
            <h2>Create Post:</h2>
            <Form.Field>
                <Form.Input
                    placeholder="Hi world"
                    name="body"
                    onChange={onChange}
                    value={values.body}
                    error={error ? true : false}
                />
                <Button type="submit" color="teal">Submit</Button>
            </Form.Field>
          </Form>
          {error && (
            <div className="ui error message" style={{marginBottom: 20}}>
              <ul className="list">
                <li>{error.graphQLErrors[0].message}</li>
              </ul>
            </div>
          )}
        </>
    )
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likesCount
      comments {
        id
        body
        username
        createdAt
      }
      commentsCount
    }
  }
`;

export default PostForm;
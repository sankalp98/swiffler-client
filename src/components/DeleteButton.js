import React, { useState } from 'react'
import { Button, Icon, Confirm, Popup } from 'semantic-ui-react'
import {useMutation} from '@apollo/client'
import gql from 'graphql-tag'
import {FETCH_POSTS_QUERY} from '../util/graphql'

function DeleteButton(props){
    const [confirmOpen, setConfirmOpen] = useState(false)

    const mutation = props.commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION

    const [deletePostOrComment] = useMutation(mutation, {
        update(proxy){
            setConfirmOpen(false)
            //ToDO remove post from cache
            if(!props.commentId){
                const data = proxy.readQuery({
                    query: FETCH_POSTS_QUERY
                })
                console.log("doing cache query")
                //data.getPosts = data.getPosts.filter(p => p.id !== props.postId)
                const newData = {
                    getPosts: data.getPosts.filter(p => p.id !== props.postId)
                  }
                proxy.writeQuery({
                    query: FETCH_POSTS_QUERY,
                    data: {
                        ...data,
                        getPosts: {
                          newData,
                        }
                      }
                })
            }
            if(props.callback){
                props.callback()
            }
        },
        variables: {
            postId: props.postId,
            commentId: props.commentId
        }
    })

    return (
        <>
        <Popup
            content={props.commentId ? "Delete comment" : "Delete post"}
            inverted
            trigger={
                <Button as="div" color="red" floated="right" onClick={() => setConfirmOpen(true)}>
                    <Icon name="trash" style={{ margin: 0 }}/>
                </Button>
            }
        />
        <Confirm open={confirmOpen} onCancel={() => setConfirmOpen(false)} onConfirm={deletePostOrComment}/>
        </>
    )
}

const DELETE_POST_MUTATION = gql `
    mutation deletePost($postId: ID!){
        deletePost(postId: $postId)
    }
`

const DELETE_COMMENT_MUTATION = gql `
    mutation deleteComment($postId: ID!, $commentId: ID!){
        deleteComment(postId: $postId, commentId: $commentId){
            id
            comments{
                id
                username
                body
                createdAt
            }
            commentsCount
        }
    }
`

export default DeleteButton;
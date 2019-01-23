import React from 'react'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Debug } from './Debug'
import { css } from '@emotion/core'
import theme from '../../../config/theme'
import { bpMaxSM } from '../../lib/breakpoints'

const SubscribeSchema = Yup.object().shape({
  email_address: Yup.string()
    .email('Invalid email address')
    .required('Required'),
  first_name: Yup.string()
})

const PostSubmissionMessage = ({ response }) => {
  return <div>Thanks! You've been added to the list.</div>
}

class SignUp extends React.Component {
  state = {
    submitted: false,
  }

  async handleSubmit(values) {
    this.setState({ submitted: true, loading: true })
    try {
      const response = await fetch(
        'https://app.convertkit.com/forms/834199/subscriptions',
        {
          method: 'post',
          body: JSON.stringify(values, null, 2),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      )

      const responseJson = await response.json()

      this.setState({
        submitted: true,
        loading: false,
        response: responseJson,
        errorMessage: null,
      })
    } catch (error) {
      this.setState({
        submitted: false,
        loading: false,
        errorMessage: 'Something went wrong!',
      })
    }
  }

  render() {
    const { submitted, loading, response, errorMessage } = this.state
    const successful = response && response.status === 'success'
    return (
      <div>
        <h2>Join the Newsletter</h2>
        {loading && <div>Submitting...</div>}
        {!submitted &&
          !loading && (
            <Formik
              initialValues={{
                email_address: '',
                first_name: '',
              }}
              validationSchema={SubscribeSchema}
              onSubmit={values => this.handleSubmit(values)}
              render={({ errors, touched }) => (
                <Form
                  css={css`
                    display: flex;
                    align-items: flex-end;
                    label:not(:first-of-type),
                    button {
                      margin-left: 10px;
                    }
                    .field-error {
                      display: block;
                      position: absolute;
                      color: ${theme.colors.red};
                      font-size: 80%;
                    }
                    input,
                    label {
                      width: 280px;
                    }
                    ${bpMaxSM} {
                      flex-direction: column;
                      align-items: center;
                      width: auto;
                      label {
                        margin: 15px 0 !important;
                      }
                      button {
                        margin-top: 20px;
                      }
                    }
                  `}
                >
                  <label htmlFor="first_name">
                    First Name
                    <Field
                      aria-label="your first name"
                      aria-required="true"
                      name="first_name"
                      placeholder="Jane"
                      type="text"
                    />
                    <ErrorMessage
                      name="first_name"
                      component="span"
                      className="field-error"
                    />
                  </label>
                  <label htmlFor="email">
                    Email
                    <Field
                      aria-label="your email address"
                      aria-required="true"
                      name="email_address"
                      placeholder="jane@acme.com"
                      type="email"
                    />
                    <ErrorMessage
                      name="email_address"
                      component="span"
                      className="field-error"
                    />
                  </label>
                  <button data-element="submit" type="submit">
                    Submit
                  </button>
                  {/* <Debug /> */}
                </Form>
              )}
            />
          )}
        {submitted && !loading && <PostSubmissionMessage response={response} />}
        {errorMessage && <div>{errorMessage}</div>}
      </div>
    )
  }
}

export default SignUp

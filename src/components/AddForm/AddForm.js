import React, { Component } from 'react'
import { Input, Button, Form, TextArea, Grid, Segment } from 'semantic-ui-react'

import './../../semantic/components/input.css'
import './../../semantic/components/form.css'
import './../../semantic/components/button.css'
import './../../semantic/components/grid.css'
import './../../semantic/components/segment.css'

import './AddForm.css'

import Calendar from 'rc-calendar'
import 'rc-calendar/assets/index.css';

class AddForm extends Component {
  initialState() {
    return {
      title: '',
      date: null,
      text: ''
    }
  }

  constructor(props) {
    super(props)
    this.state = this.initialState()
  }

  handleTitleChange = (event, data) => {
    const text = data.value
    this.setState({title: text})
  }

  handleDateChange = (value) => {
    this.setState({date: value})
  }

  handleTextChange = (event, data) => {
    const text = data.value
    this.setState({text: text})
  }

  save = () => {
    const { title, date, text} = this.state

    // ajax save it to the server here
  }

  createEntry = () => {
    const { create, go } = this.props
    const { title, date, text } = this.state

    // have to fill everything
    if (title.trim() === '') { return }
    if (date === null) { return }
    if (text.trim() === '') { return }

    console.log('create an entry', title, date, text)

    create(title, date, text)

    this.save()

    this.setState(this.initialState())
    go('/')
  }

  render() {
    const { title, date, text } = this.state
    const { go } = this.props

    return (
      <div className="addform">
        <Grid columns={15}>
          <Grid.Column width={4}>
            <Calendar onChange={this.handleDateChange} value={date} className="addform-calendar"/>
          </Grid.Column>
          <Grid.Column width={11}>
            <Segment clearing>
              <p>Select the day you would like to write a journal entry for on the left, then express yourself!</p>
              <Form>
                <Form.Field>
                  <label>What would you call today?</label>
                  <Input placeholder='Title' onChange={this.handleTitleChange} value={title} fluid/><br/><br/>
                </Form.Field>
                <Form.Field>
                  <label>What did you do today?</label>
                  <TextArea autoHeight placeholder='Text' onChange={this.handleTextChange} value={text}/><br/><br/>
                </Form.Field>
              </Form>
              <div>
                <Button onClick={() => {go('/')}} floated='left'>Go Back</Button>
                <Button onClick={this.createEntry} color='green' floated='right'>Add</Button>
              </div>
            </Segment>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default AddForm;
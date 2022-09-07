import mongoose from 'mongoose'

/* This hopefully creates a singleton across the app ? 
 * and also encapsulates possible middleware implementations ? */

const model = mongoose.model
const schema = mongoose.Schema

export { model, schema }

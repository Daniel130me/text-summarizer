import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'

const Doc = () => {
  return (
    <div>
      <SwaggerUI url='/openapi.yaml' />
    </div>
  )
}

export default Doc

export default function Error({path, error}) {
  if(!error) return;
  for(let i = 0; i < error.length; i++) {
    if (error[i].path == path) {
      return (
        <div className='error'>{error[i].msg}</div>
      )
    }
  }
}
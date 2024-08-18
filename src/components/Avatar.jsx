import avatar from '../../public/avatar.png'

export default function Avatar(props) {
  const src = props?.src || avatar
  return <img className='avatar' {...props} src={src} />
}
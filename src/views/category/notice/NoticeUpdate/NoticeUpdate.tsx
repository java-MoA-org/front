import './NoticeUpdate.css'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'

const NoticeUpdate = () => {
  const { id } = useParams<{ id: string }>()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    axios.get(`/api/v1/notice/${id}`)
      .then(res => {
        setTitle(res.data.title)
        setContent(res.data.content)
      })
  }, [id])

  const handleUpdate = async () => {
    try {
      await axios.put(`/api/v1/notice/update/${id}`, { title, content })
      alert('공지 수정 완료')
      navigate('/notice')
    } catch (e) {
      alert('수정 실패')
    }
  }

  return (
    <div className="notice-update">
      <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
      <textarea value={content} onChange={e => setContent(e.target.value)} />
      <button onClick={handleUpdate}>수정</button>
    </div>
  )
}

export default NoticeUpdate

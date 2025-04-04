import { useForm } from 'react-hook-form'
import { supabase } from './supabaseClient'


export default function IntakeForm() {
  const { register, handleSubmit } = useForm()

  const onSubmit = async (data: any) => {
    try {
      const res = await fetch('http://localhost:8000/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
  
      const result = await res.json()
      const score = result.priority_score
  
      // Save to Supabase
      const { error } = await supabase.from('priority_queue').insert({
        ...data,
        injured: data.injured === 'yes',
        priority_score: score,
      })
  
      if (error) {
        console.error('Supabase insert error:', error)
        alert('Error saving to database')
      } else {
        alert(`Your priority score is: ${score}`)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Failed to submit form')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 500 }}>
      <h2>Shiftwave Intake Form</h2>

      <input {...register('name')} placeholder="Full Name" required />
      <input {...register('email')} placeholder="Email Address" type="email" required />

      <label>Athlete Type:</label>
      <select {...register('athlete_type')} required>
        <option value="none">General Consumer</option>
        <option value="college">College Athlete</option>
        <option value="pro">Pro Athlete</option>
        <option value="retired">Retired Athlete</option>
      </select>

      <label>Season Status:</label>
      <select {...register('season_status')} required>
        <option value="offseason">Offseason</option>
        <option value="inseason">In Season</option>
        <option value="playoffs">Playoffs</option>
      </select>

      <label>Are you currently injured?</label>
      <select {...register('injured')} required>
        <option value="no">No</option>
        <option value="yes">Yes</option>
      </select>

      <label>Use Case:</label>
      <select {...register('use_case')} required>
        <option value="performance">Performance</option>
        <option value="needs_based">Needs Based (health, stress, autoimmune)</option>
        <option value="both">Both</option>
      </select>

      <button type="submit">Submit</button>
    </form>
  )
}

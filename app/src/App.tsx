import { useState } from "react";
import { generateFormValues } from "./use-ai/hook";
import { z } from "zod/v4";
import { useForm } from "react-hook-form";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().min(18),
});

type Schema = z.infer<typeof schema>;

function App() {
  const { register, handleSubmit, setValue, setError} = useForm<Schema>();
  const [textContent, setTextContent] = useState("");
  
  function gen() {
    generateFormValues(textContent, schema).then((response) => {
      for (const [key, value] of Object.entries(response.fields)) {
        setValue(key as keyof Schema, value);
      }
      for (const [key, value] of Object.entries(response.errors)) {
        setError(key as keyof Schema, {
          message: value?.join(", "),
        });
      }
    }).catch((error) => {
      console.error(error);
    });
    
  }
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
       <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <h1>Form</h1>
      <label htmlFor="name">Name
      </label>
      <input type="text" {...register("name")} />
      <label htmlFor="email">Email</label>
      <input type="text" {...register("email")} />
      <label htmlFor="age">Age</label>
      <input type="number" {...register("age")} />
      <button type="submit">Submit</button>
      <button type="button" onClick={gen}>Generate Form</button>
      
    </div>
    <input type="text" value={textContent} onChange={(e) => setTextContent(e.target.value)} />
    </div>
   
    
       
  )
}

export default App

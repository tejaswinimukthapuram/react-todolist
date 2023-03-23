import { object, string, number, InferType } from 'yup';

import React from 'react';

let userSchema = object({
    title: string().required(),
    
    
  });

  export default userSchema;
  
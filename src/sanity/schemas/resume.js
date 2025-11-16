
//snaity reums eschema
export default {
  name: 'resume',
  title: 'Resume',
  type: 'document',
  fields: [
    {
      name: 'pdf',
      title: 'Resume PDF',
      type: 'file',
      options: {
        accept: '.pdf',
      },
    },
  ]  
};
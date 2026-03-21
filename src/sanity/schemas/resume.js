
//snaity reums eschema
const resume = {
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

export default resume;
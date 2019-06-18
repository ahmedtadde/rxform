export default {
  fields: {
    confirmPassword: {
      dependencies: ['password'],
      events: {
        blur: true,
        change: true,
        input: true
      },
      selector: `#form [name='confirmPassword']`,
      value: (e: Event) => e,
      resolver: {
        map: (value: any) => value,
        filter: (value: any) => true
      }
    },
    password: {}
  },
  target: '#form'
};

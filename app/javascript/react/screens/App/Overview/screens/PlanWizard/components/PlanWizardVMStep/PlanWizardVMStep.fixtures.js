import Immutable from 'seamless-immutable';

export const initialState = Immutable({
  isValidatingVms: false,
  isRejectedValidatingVms: false,
  validationServiceCalled: false,
  errorValidatingVms: null,
  valid_vms: [],
  invalid_vms: [],
  conflict_vms: [],
  validateVmsUrl: '/api/dummyValidateVmsUrl'
});

export const validateVMsData = {
  method: 'POST',
  response: {
    data: {
      valid_vms: [
        {
          href: 'http://localhost:3000/api/transformation_mappings/2222',
          name: 'APP01_VM',
          cluster: 'VMWareCluster1',
          path: 'VMW/VM1',
          allocated_size: '266000026560.0',
          id: '2222',
          reason: 'OK'
        },
        {
          href: 'http://localhost:3000/api/transformation_mappings/2223',
          name: 'APP02_VM',
          cluster: 'VMWareCluster1',
          path: 'VMW/VM2',
          allocated_size: '266480000000.0',
          id: '2223',
          reason: 'OK'
        },
        {
          href: 'http://localhost:3000/api/transformation_mappings/2224',
          name: 'WEB01_VM',
          cluster: 'VMWareCluster1',
          path: 'VMW/VM3',
          allocated_size: '83100000000.0',
          id: '2224',
          reason: 'OK'
        },
        {
          href: 'http://localhost:3000/api/transformation_mappings/2225',
          name: 'APP03_VM',
          cluster: 'VMWareCluster2',
          path: 'VMW/VM4',
          allocated_size: '276480000000.0',
          id: '2225',
          reason: 'OK'
        },
        {
          href: 'http://localhost:3000/api/transformation_mappings/2226',
          name: 'APP04_VM',
          cluster: 'VMWareCluster2',
          path: 'VMW/VM5',
          allocated_size: '64000000000.0',
          id: '2226',
          reason: 'OK'
        },
        {
          href: 'http://localhost:3000/api/transformation_mappings/2227',
          name: 'WEB03_VM',
          cluster: 'VMWareCluster2',
          path: 'VMW/VM6',
          allocated_size: '64000000000.0',
          id: '2227',
          reason: 'OK'
        },
        {
          href: 'http://localhost:3000/api/transformation_mappings/2228',
          name: 'DB01_VM',
          cluster: 'VMWareCluster2',
          path: 'VMW/VM7',
          allocated_size: '64000000000.0',
          id: '2228',
          reason: 'OK'
        },
        {
          href: 'http://localhost:3000/api/transformation_mappings/2229',
          name: 'DB02_VM',
          cluster: 'VMWareCluster2',
          path: 'VMW/VM8',
          allocated_size: '64000000000.0',
          id: '2229',
          reason: 'OK'
        }
      ],
      invalid_vms: [],
      conflict_vms: []
    }
  }
};

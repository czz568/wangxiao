const termName = (rule, val, cb) => {
    if (val.length > 100) {
      cb(new Error('条款名称不超过100字'))
    }
    cb()
  }
   
  export const lengthValidator = (rule, val, cb) => {
    if (val.length > rule.maxLength) {
      cb(new Error(rule.message))
    }
    cb()
  }
   
  // 数字框的处理保留
  const moneyValidChange = (rule, val, cb) => {
    // eslint-disable-next-line no-useless-escape
    val = val.replace(/\,/g, '').replace('-', '')
    if (this._isEmpty(val)) {
      cb(new Error('请填写合同金额'))
    } else if (this.isNumberInt(val)) {
      cb(new Error('请输入正确数字'))
    }
    cb()
  }
   
  const applyText = (rule, val, cb) => {
    if (val && val.length > 100) {
      cb(new Error(rule.name + '不超过100字'))
    }
    cb()
  }
  const termKeyWord = (rule, val, cb) => {
    if (val && val.length > 30) {
      cb(new Error('不超过30字，关键字之间以逗号间隔'))
    }
    cb()
  }
   
  const moneyValidBlur = (rule, val, cb) => {
    // eslint-disable-next-line no-useless-escape
    val = val.replace(/\,/g, '').replace('-', '')
    if (this._isEmpty(val)) {
      cb(new Error('请填写合同金额'))
    } else if (this.isNumberInt(val)) {
      cb(new Error('请输入正确数字'))
    } else {
      this.signInfoData[rule.field] = parseFloat(val).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
    }
    cb()
  }
   
  export const signRules = {
    money: [
      { validator: moneyValidChange, trigger: 'change' },
      { validator: moneyValidBlur, trigger: 'blur' }
    ],
    termName: [
      { required: true, message: '请输入条款名称', trigger: 'change' },
      { validator: termName, trigger: 'change' }
    ],
    industry: [
      { required: true, message: '请选择行业', trigger: 'change' }
    ],
    l1Class: [
      { required: true, message: '请选择业务类型', trigger: 'change' }
    ],
    l2Class: [
      { required: true, message: '请选择产品类型', trigger: 'change' }
    ],
    l3Class: [
      { required: true, message: '请选择产品细分', trigger: 'change' }
    ],
    applyObject: [
      { validator: applyText, trigger: 'change', name: '适用对象' }
    ],
    applyScence: [
      { validator: applyText, trigger: 'change', name: '适用场景' }
    ],
    termKeyword: [
      { validator: termKeyWord, trigger: 'change' }
    ],
    remark: [
      { validator: applyText, trigger: 'change', name: '备注' }
    ]
   
  }
   
  export const addProjectForms = () => {
    return [
      {
        type: 'input',
        label: '条款名称：',
        model: 'termName',
        prop: 'termName',
        rules: signRules.termName,
        placeholder: '条款名称不超过100字'
      },
      {
        type: 'select',
        label: '行业：',
        model: 'industry',
        prop: 'industry',
        showModel: 'industryName',
        rules: signRules.industry,
        placeholder: '',
        children: []
      },
      {
        type: 'select',
        label: '业务类型：',
        model: 'l1Class',
        prop: 'l1Class',
        showModel: 'l1ClassName',
        rules: signRules.l1Class,
        placeholder: ''
      },
      {
        type: 'select',
        label: '产品类型：',
        model: 'l2Class',
        prop: 'l2Class',
        showModel: 'l2ClassName',
        rules: signRules.l2Class,
        placeholder: '',
        children: []
      },
      {
        type: 'select',
        label: '产品细分：',
        model: 'l3Class',
        prop: 'l3Class',
        showModel: 'l3ClassName',
        rules: signRules.l3Class,
        placeholder: '',
        children: []
      },
      {
        type: 'autoComp',
        label: '条款主标签：',
        model: 'mainTag',
        prop: 'mainTag',
        showModel: 'mainTagName',
        eventName: 'mainTagEvent',
        placeholder: '',
        children: []
      },
      {
        type: 'autoComp',
        label: '条款次标签：',
        model: 'secTag',
        prop: 'secTag',
        showModel: 'secTagName',
        eventName: 'secTagEvent',
        placeholder: '',
        children: []
      },
      {
        type: 'input',
        label: '条款关键字：',
        model: 'termKeyword',
        rules: signRules.termKeyword,
        prop: 'termKeyword',
        placeholder: '不超过30字。例：银行同业,货币基金',
        children: []
      },
      {
        type: 'textarea',
        label: '适用对象：',
        model: 'applyObject',
        prop: 'applyObject',
        rules: signRules.applyObject,
        class: 'middleSize',
        placeholder: '100个字内',
        children: []
      },
      {
        type: 'textarea',
        label: '适用场景：',
        model: 'applyScence',
        prop: 'applyScence',
        rules: signRules.applyScence,
        class: 'middleSize',
        placeholder: '100个字内',
        children: []
      },
      {
        type: 'textarea',
        label: '备注：',
        model: 'remark',
        prop: 'remark',
        rules: signRules.remark,
        class: 'middleSize',
        placeholder: '100个字内',
        children: []
      }
   
    ]
  }
   
  // 范例字段
  export const exampleForms = () => {
    return [
      {
        type: 'inputSlot',
        label: '所属合约名称',
        model: 'contractName',
        prop: 'contractName',
        slot: 'contractName',
        class: 'contractName',
        placeholder: '所属合约名称不超过60字'
      },
      {
        type: 'input',
        label: '一级章节名称 ',
        model: 'chapterOneName',
        prop: 'chapterOneName',
        placeholder: '例:"第一章增级对象“'
      },
      {
        type: 'input',
        label: '二级章节名称 ',
        model: 'chapterTwoName',
        prop: 'chapterTwoName',
        isShow: true,
        placeholder: '例:"1.1内部增级“'
      },
      {
        type: 'input',
        label: '三级章节名称 ',
        model: 'chapterThreeName',
        prop: 'chapterThreeName',
        isShow: true,
        placeholder: '例:"4.1.1内部增级的具体策略"'
      },
      {
        type: 'input',
        label: '四级章节名称 ',
        model: 'chapterFourName',
        prop: 'chapterFourName',
        isShow: true,
        placeholder: '例“4.1.1.1内部增级的方式”'
      },
      {
        type: 'text',
        slot: 'optionBtn',
        prop: 'optionBtn',
        class: 'optionBtn'
      },
      {
        type: 'textarea',
        label: '范例内容',
        model: 'exampleContent',
        prop: 'exampleContent',
        class: 'lineMiddleSize',
        placeholder: '1000个字内'
      }
    ]
  }
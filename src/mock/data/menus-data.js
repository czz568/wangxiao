export const mockMenuData = [
  {
    'id': '1',
    'path': '/user',
    'name': 'user',
    'meta': {
      'icon': 'ios-people',
      'title': '用户',
      'hideInMenu': false,
      'showAlways': true
    },
    'component': 'Main',
    'children': [
      {
        'id': '01',
        'path': 'student',
        'name': 'student',
        'meta': {
          'icon': '',
          'title': '学员管理',
          'hideInMenu': false,
          'showAlways': false
        },
        'component': 'user/student/student'
      },
      {
        'id': '02',
        'path': 'studentEdit',
        'name': 'studentEdit',
        'meta': {
          'icon': '',
          'title': '新增/编辑学员',
          'hideInMenu': true,
          'showAlways': false,
        },
        'component': 'user/student/studentEdit'
      },
      {
        'id': '03',
        'path': 'teacher',
        'name': 'teacher',
        'meta': {
          'icon': '',
          'title': '讲师管理',
          'hideInMenu': false,
          'showAlways': false,
        },
        'component': 'user/teacher/teacher'
      },
      {
        'id': '04',
        'path': 'teacherEdit',
        'name': 'teacherEdit',
        'meta': {
          'icon': '',
          'title': '新增/编辑讲师',
          'hideInMenu': true,
          'showAlways': false,
        },
        'component': 'user/teacher/teacherEdit'
      },
      {
        'id': '05',
        'path': 'assist',
        'name': 'assist',
        'meta': {
          'icon': '',
          'title': '助教管理',
          'hideInMenu': false,
          'showAlways': false,
        },
        'component': 'user/assist/assist'
      },
      {
        'id': '06',
        'path': 'assistEdit',
        'name': 'assistEdit',
        'meta': {
          'icon': '',
          'title': '新增/编辑助教',
          'hideInMenu': true,
          'showAlways': false,
        },
        'component': 'user/assist/assistEdit'
      }
    ]
  },
  {
    'id': '2',
    'path': '/teach',
    'name': 'teach',
    'meta': {
      'icon': 'md-school',
      'title': '教学',
      'hideInMenu': false,
      'showAlways': true
    },
    'component': 'Main',
    'children': [
      {
        'id': '111',
        'path': 'courseList',
        'name': 'courseList',
        'meta': {
          'icon': '',
          'title': '课程管理',
          'hideInMenu': false,
          'showAlways': false,
        },
        'component': 'teach/course/manage/courseList'
      },
      {
        'id': '112',
        'path': 'courseEdit',
        'name': 'courseEdit',
        'meta': {
          'icon': '',
          'title': '新增/编辑课程',
          'hideInMenu': true,
          'showAlways': false,
        },
        'component': 'teach/course/manage/courseEdit'
      },
      {
        'id': '113',
        'path': 'coursePlan',
        'name': 'coursePlan',
        'meta': {
          'icon': '',
          'title': '课程大纲',
          'hideInMenu': true,
          'showAlways': false,
        },
        'component': 'teach/course/manage/coursePlan'
      },
      {
        'id': '114',
        'path': 'classHourEdit',
        'name': 'classHourEdit',
        'meta': {
          'icon': '',
          'title': '新增/编辑课时',
          'hideInMenu': true,
          'showAlways': false,
        },
        'component': 'teach/course/manage/classHourEdit'
      }
    ]
  },
  {
    'id': '10',
    'path': '/system',
    'name': 'system',
    'meta': {
      'icon': 'ios-cog',
      'title': '系统',
      'hideInMenu': false,
      'hideInBread': false,
      'showAlways': true,
      'notCache': false,
    },
    'component': 'Main',
    'children': [
      {
        'id': '311',
        'path': 'account',
        'name': 'account',
        'meta': {
          'icon': '',
          'title': '账号管理',
          'hideInMenu': false,
          'showAlways': false,
        },
        'component': 'system/setting/account/account'
      },
      {
        'id': '312',
        'path': 'accountEdit',
        'name': 'accountEdit',
        'meta': {
          'icon': '',
          'title': '新增/编辑账号',
          'hideInMenu': true,
          'showAlways': false
        },
        'component': 'system/setting/account/accountEdit'
      },
      {
        'id': '313',
        'path': 'role',
        'name': 'role',
        'meta': {
          'icon': '',
          'title': '角色管理',
          'hideInMenu': false,
          'showAlways': false,
        },
        'component': 'system/setting/role/role'
      },
      {
        'id': '314',
        'path': 'roleEdit',
        'name': 'roleEdit',
        'meta': {
          'icon': '',
          'title': '新增/编辑角色',
          'hideInMenu': true,
          'showAlways': false
        },
        'component': 'system/setting/role/roleEdit'
      },
      {
        'id': '315',
        'path': 'menu',
        'name': 'menu',
        'meta': {
          'title': "菜单管理",
          'icon': "",
          'hideInBread': false,
          'hideInMenu': false,
          'notCache': false,
        },
        'component': 'system/setting/menu/menu'
      },
      {
        'id': '316',
        'path': 'attribute',
        'name': 'attribute',
        'meta': {
          'icon': '',
          'title': '属性管理',
          'hideInMenu': false,
          'showAlways': false
        },
        'component': 'system/setting/attribute/attribute'
      }
    ]
  }
]

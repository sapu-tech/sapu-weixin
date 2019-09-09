module.exports = {
  commands: {
    'reserve': 'reserve',
    'list': 'list',
    'new': 'new',
    'setname': 'setname',
    'delete': 'delete',
    'flirt': 'flirt',
    'all': 'all',
    'info': 'info',
    'recommend': 'recommend',
    'language': 'language',
    'set': 'set',
    'version': 'version',
  },

  'arguments_error': 'Arguments error!',

  'reserve_help': 'Usage:\n'
                  + '  reserve list\n'
                  + '  reserve new [month] [date] [start] [end] [place]\n'
                  + '  reserve delete [month] [date] [id]\n'
                  + 'notes: place 0 stands for B241, 1 for B255\n'
                  + '       if you want to reserve by half-clock, please use \'.5\' after hour number\n'
                  + '       Please place your reservation before a day and within a week.',
  'reserve_new_set_name_notice': 'First you need to set your name (can be modified later on).\n'
                      + 'Usage:\n  setname [name]',
  'reserve_new_id': 'Reserved! Id: %d .',
  'reserve_new_failed': 'Cannot make reservation. Time Conflict. Please contact %s.',
  'reserve_new_argument_error': 'Time format error!',
  'reserve_new_too_far_soon_error': 'Cannot make reservation that is a month later.',
  'reserve_delete_id': 'Deleted %d-%d id %d.',
  'reserve_delete_failed': 'Deleted %d-%d id %d failed! %s',
  'reserve_delete_no_found': 'Reservation not found.',
  'reserve_delete_forbidden': 'Deleting other\'s reservation forbidden.',
  'reserve_time_out_of_period_not_today': 'Please place your reservation before a day and within a week.',
  'reserve_time_out_of_period_not_a_week_later': 'Please place your reservation before a day and within a week.',

  'setname_help': 'Usage:\n  setname [name]',
  'username_set_name_to': 'Successfully set name to \'%s\'',
  'username_not_blank': 'Username cannot be blank!',
  
  'root_help': 'Thanks for your attention to SAPU! We will try our best to inform you our activity info and intersting music tips!\n'
    + '(It\'s quite a pity that we may not response in the first time, so sit back and relax~~ If nothing is replied after 48 hours, please send your request again, or we may never get in touch with you!\n\n'
    + 'Usage of sapu-weixin bot:\n'
    + '  reserve list\n'
    + '  reserve new [month] [date] [start] [end] [place]\n'
    + '  reserve delete [month] [date] [id]\n'
    + '  setname [name]\n'
    + '  info [index]\n'
    + '  recommend\n'
    + '  flirt\n'
    + '  version\n\n'
    + 'examples:\n'
    + '  reserve new 9 6 18.5 20 0\n'
    + '  setname xDroid\n\n'
    + 'notes: place 0 stands for B241, 1 for B255\n'
    + '       if you want to reserve by half-clock, please use \'.5\' after hour number\n'
    + '       Please place your reservation before a day and within a week.',
  
  'view_reservations_followed_below': 'Reservations in 10 days are followed below:',
  'view_no_reservations': 'No reservations at this time.',
  'view_short_no_reservations': 'No reservations in the following 10 days.',
  'view_subtitle': '%d-%d :',
  'view_reservtion': '  %d by %s on %s from %s to %s at %s',

  'info_not_found': '对不起，暂时没有序号 %d 的内容',
  'info_help': '请输入“信息 [序号]”查询相关信息',
  'info_helps': [
    '社团简介',
    '弦乐团简介',
    '教学班简介',
    '弦乐团、小室内乐团排练时间',
    '各小组排练时间',
    '提琴社近期活动安排',
  ],
  'info_contents': [
    '北京大学提琴社弦乐团是由北京大学提琴社社员组成的一支中型弦乐乐团，由小提琴手、中提琴手和大提琴手组成，平时定期组织排练，每年会举办专场音乐会以展示一年排练成果。弦乐团下方设有多个小组，小组形式为弦乐重奏，小组也参加弦乐团每年的专场演出。',
    '北京大学提琴社成立于2009年10月，是由400余成员组成的学生艺术社团 ，社团日常活动涉及合奏演出、提琴教学、学生支教以及讲座、观影等各类音乐文化普及活动。立足北大传统，心怀音乐梦想，北京大学提琴社力图在提高社员音乐修养的同时为推广古典音乐贡献自己的力量。',
    '提琴社目前开设小提琴零基础班、小提琴提高班、一对一/一对二班、大提琴基础班，每学期初报名开课。\n'
      + '以下为具体介绍：\n'
      + '\n'
      + '（一）零基础班\n'
      + '【适合人群】从未学习过小提琴的同学。\n'
      + '【教学形式】采用集体教学的形式，班额在20人以内，每学期共8次课，每次课一小时。\n'
      + '【教学内容】采用统一的教学内容，主要包括基础乐理知识、基本姿势、运弓、第一把位音阶、第一把位简单乐曲等；使用教学班自印教学资料。\n'
      + '【教员情况】每班2名教员，均为提琴社弦乐团高水平成员。\n'
      + '【上课时间】16年秋季：A班-周六19:30—20:30；B班-周六20:30—21:30。\n'
      + '【上课地点】新太阳教室。\n'
      + '【学费情况】400元/人/学期。\n'
      + '\n'
      + '（二）一对一班\n'
      + '【适合人群】曾经学习过小提琴的同学；虽无小提琴基础但想接受更加具有针对性指导的同学。\n'
      + '【教学形式】采用个别教学的形式，每学期共8次课，每次课一小时。\n'
      + '【教学内容】教学内容不作统一规定，由教员根据学员原有基础、学习目标等实际情况量身定做；是否需要及需要何种教学资料，由学员与教员自行协商确定。\n'
      + '【教员情况】教员为提琴社弦乐团高水平成员，若干名。\n'
      + '【学费情况】一对一：800元/人/学期；一对二：600元/人/学期。\n'
      + '\n'
      + '（三）提高班（春季学期开课）\n'
      + '（四）大提琴基础班（今年暂不开班）\n',
    '弦乐团排练：\n周日10:00~12:00\n新太阳B108\n\n小室内乐团排练：\n待定',
    '小组排练信息即将上线……',
    '提琴社近期活动安排\n'
      + '湖畔音乐会\n'
      + '时间：10月22日下午3:00\n'
      + '地点：未名湖花神庙碑\n'
      + '\n'
      + '提纲音乐会\n'
      + '时间：11月12日\n'
      + '详情见提琴社公众号推送\n'
      + '\n'
      + '欢迎前来！\n',
  ],

  'language_help': `Language options:
0 中文
1 English
2 56iL5bqP5ZGY5LiT55SoCg==
Usage: language set [index]`,
  'language_set': `Language set!`,
  'language_set_failed': `Failed to set language!`,

  'flirt': ['To be added'],

  'version': {
    'log' : `HEAD -> %s\n%s`,
  },
}

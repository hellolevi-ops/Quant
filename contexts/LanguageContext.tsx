
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Nav
    'nav.dashboard': 'Dashboard',
    'nav.workshop': 'AI Workshop',
    'nav.signal_bridge': 'Signal Bridge',
    'nav.my_strategies': 'My Strategies',
    'nav.data_center': 'Data Center',
    'nav.community': 'Community',
    'nav.live_setup': 'Live Setup',
    'nav.qmt_terminal': 'QMT Terminal',
    'nav.upgrade_pro': 'Upgrade Pro',
    'nav.profile': 'Profile',

    // Landing
    'landing.status': 'System Status: V2.0 Stable Live',
    'landing.hero_title_1': 'Institutional Alpha,',
    'landing.hero_title_2': 'Democratized by AI.',
    'landing.hero_desc': 'The first quantitative ecosystem driven by Large Language Models. Generate institutional-grade Python strategies from natural language or mirror top-performing portfolios across the web instantly.',
    'landing.btn_start': 'Start Building Free',
    'landing.btn_docs': 'View API Docs',
    'landing.btn_launch': 'Launch Terminal',
    'landing.nav_platform': 'Platform',
    'landing.nav_engine': 'AI Engine',
    'landing.nav_bridge': 'Signal Bridge',
    'landing.nav_data': 'Data',
    'landing.core_engines': 'Core Engines',
    'landing.core_desc': 'Powered by dual engines for creation and replication.',
    'landing.feat_gen_title': 'Generative Code Engine',
    'landing.feat_gen_desc': 'Describe your logic in plain English. Our fine-tuned LLMs generate production-ready Python (Backtrader/QMT) code instantly with 0 syntax errors.',
    'landing.feat_bridge_title': 'Universal Signal Bridge',
    'landing.feat_bridge_desc': 'Break the walled gardens. Paste a URL from Snowball, JoinQuant, or iFind, and mirror trades in real-time with sub-millisecond latency.',
    'landing.feat_risk_title': 'Institutional Risk Control',
    'landing.feat_risk_desc': 'Built-in PIT (Point-in-Time) data cleaning, slippage protection, and automated rebalancing. We protect your capital before it enters the market.',
    'landing.data_title': 'Full-Stack Data Center',
    'landing.data_desc': 'Access clean, adjusted historical data and real-time streams for global markets.',
    'landing.data_btn': 'Explore Data Center',
    'landing.footer_rights': '© 2024 Quant AI Inc. Institutional Edition.',
    'landing.login': 'Log In',
    'landing.signup': 'Sign Up',
    'landing.demo_url_ph': 'Paste URL (e.g. Snowball/JoinQuant)',
    'landing.demo_parse': 'Parse Strategy',
    'landing.demo_analyzing': 'Analyzing...',
    'landing.demo_acquired': 'Signal Acquired',
    'landing.demo_result_return': 'Total Return',
    'landing.demo_cta_login': 'Log In to Mirror',

    // Auth
    'auth.login_title': 'Welcome Back',
    'auth.login_desc': 'Sign in to access your trading console',
    'auth.register_title': 'Create Account',
    'auth.register_desc': 'Start your journey to institutional alpha',
    'auth.email': 'Email Address',
    'auth.phone': 'Phone Number',
    'auth.password': 'Password',
    'auth.confirm_password': 'Confirm Password',
    'auth.fullname': 'Full Name',
    'auth.remember': 'Remember me',
    'auth.forgot': 'Forgot password?',
    'auth.signin': 'Sign In',
    'auth.signup': 'Create Account',
    'auth.have_account': 'Already have an account?',
    'auth.no_account': "Don't have an account?",
    'auth.terms': 'I agree to the Terms of Service and Privacy Policy',
    'auth.or_continue': 'Or continue with',
    'auth.tab_pwd': 'Password',
    'auth.tab_sms': 'SMS Code',
    'auth.tab_wechat': 'WeChat',
    'auth.captcha': 'Captcha',
    'auth.sms_code': 'SMS Code',
    'auth.get_code': 'Get Code',
    'auth.resend': 'Resend',
    'auth.scan_wechat': 'Scan with WeChat',
    'auth.bind_wechat_title': 'Bind WeChat',
    'auth.bind_wechat_desc': 'Link your WeChat account for instant login and trade notifications.',
    'auth.skip': 'Skip for now',
    'auth.bind': 'Bind Now',

    // Dashboard
    'dash.hero_title': 'Build Institutional-Grade',
    'dash.hero_title_highlight': 'Alpha with AI',
    'dash.hero_desc': 'Eliminate technical barriers. Use natural language to generate robust trading strategies or instantly mirror top-performing portfolios from external platforms.',
    'dash.btn_generate': 'Generate Strategy',
    'dash.btn_copy': 'Start Copy Trading',
    'dash.stat_vol': 'Total Trading Vol',
    'dash.stat_vol_sub': 'Platform wide real-time volume',
    'dash.stat_active': 'Active Strategies',
    'dash.stat_active_sub': 'Running across QMT & Ptrade',
    'dash.stat_apy': 'Top APY Today',
    'dash.stat_apy_sub': "Strategy: 'Alpha-Dragon-V2'",
    'dash.market_sentiment': 'Market Sentiment',
    'dash.recent_signals': 'Recent Community Signals',

    // Workshop
    'work.title': 'AI Assistant',
    'work.model_select': 'Model',
    'work.empty_state': 'Describe your strategy idea.',
    'work.empty_hint': 'e.g., "Buy Apple when RSI is below 30 and sell when above 70"',
    'work.input_placeholder': 'Input strategy logic...',
    'work.code_title': 'Python Strategy',
    'work.btn_format': 'Format',
    'work.code_placeholder': '# AI generated code will appear here...',
    'work.backtest_title': 'Backtest Configuration',
    'work.ready_test': 'Ready to test',
    'work.sharpe': 'Sharpe Ratio',
    'work.max_dd': 'Max Drawdown',
    'work.btn_run': 'Run Backtest',
    'work.btn_running': 'Running Simulation...',
    'work.date_start': 'Start Date',
    'work.date_end': 'End Date',

    // Signal Bridge
    'bridge.title': 'Universal Signal Bridge',
    'bridge.desc': 'Connect external portfolio URLs to automate signal copying.',
    'bridge.input_placeholder': 'Paste URL (e.g., https://xueqiu.com/P/ZH123456)',
    'bridge.btn_connect': 'Connect',
    'bridge.btn_analyzing': 'Parsing...',
    'bridge.btn_connected': 'Connected',
    'bridge.status_waiting': 'Waiting for signal source...',
    'bridge.status_crawling': 'Crawling portfolio data...',
    'bridge.risk_title': 'Risk Management',
    'bridge.risk_multiplier': 'Copy Multiplier',
    'bridge.risk_reverse': 'Reverse Copy (Short)',
    'bridge.risk_slippage': 'Slippage protection enabled. Orders > 2% deviation will be rejected.',
    'bridge.stream_title': 'Live Signal Stream',

    // My Strategies
    'mystrat.title': 'My Strategies',
    'mystrat.tab_self': 'Self-Developed',
    'mystrat.tab_copy': 'Follow/Copy',
    'mystrat.assets': 'Total Assets',
    'mystrat.day_pnl': 'Day P&L',
    'mystrat.active_count': 'Active Strategies',
    'mystrat.edit_modal': 'Strategy Details',
    'mystrat.btn_save': 'Save Changes',
    'mystrat.btn_pause': 'Pause Strategy',
    'mystrat.btn_start': 'Start Strategy',
    'mystrat.roi': 'ROI',
    'mystrat.maxdd': 'Max Drawdown',
    'mystrat.win_rate': 'Win Rate',
    'mystrat.code_preview': 'Code Preview',
    'mystrat.strat_name': 'Strategy Name',
    'mystrat.strat_desc': 'Description',

    // Data Center
    'data.title': 'Data Center',
    'data.tab_all': 'All Datasets',
    'data.tab_stock': 'Stocks',
    'data.tab_crypto': 'Crypto',
    'data.tab_macro': 'Macro',
    'data.tab_deriv': 'Derivatives',
    'data.sample': 'Sample Data',
    'data.api': 'API Access',
    'data.btn_copy_token': 'Copy Token',
    'data.status_active': 'Active',
    'data.status_subscribe': 'Subscribe',
    'data.price_free': 'Free',
    'data.price_pro': 'Pro',
    'data.btn_download': 'Download CSV',

    // Community
    'comm.title': 'Alpha Community',
    'comm.tab_feed': 'Feed',
    'comm.tab_market': 'Strategy Market',
    'comm.btn_post': 'New Post',
    'comm.reply': 'Reply',
    'comm.comments': 'Comments',
    'comm.post_create_title': 'Create New Post',
    'comm.post_title_ph': 'Enter post title...',
    'comm.post_content_ph': 'Share your strategy or market insights...',
    'comm.btn_publish': 'Publish Post',
    'comm.back': 'Back to Feed',
    'comm.official': 'OFFICIAL',
    'comm.subscribe': 'Subscribe',
    'comm.total_return': 'Total Return',

    // Profile
    'profile.title': 'Account Settings',
    'profile.plan': 'Current Plan',
    'profile.api_key': 'AI Model Configuration',
    'profile.api_desc': 'Configure your API keys for different AI providers to power the Strategy Workshop.',
    'profile.notifications': 'Notification Settings',
    'profile.wechat_status': 'WeChat Binding',
    'profile.btn_regenerate': 'Update Key',
    'profile.btn_bind': 'Bind WeChat',
    'profile.btn_upgrade': 'Upgrade Plan',
    'profile.provider': 'Provider',
    'profile.key_ph': 'Enter API Key (sk-...)',
    'profile.save_key': 'Save Configuration',
    'profile.email_alerts': 'Email Alerts',
    'profile.email_desc': 'Daily digest and risk alerts',
    'profile.bound': 'Connected',
    'profile.not_bound': 'Not Connected',
  },
  zh: {
    // Nav
    'nav.dashboard': '首页',
    'nav.workshop': 'AI 策略工坊',
    'nav.signal_bridge': '全网跟单',
    'nav.my_strategies': '我的策略',
    'nav.data_center': '全栈数据',
    'nav.community': '社区',
    'nav.live_setup': '实盘配置',
    'nav.qmt_terminal': 'QMT 实盘终端',
    'nav.upgrade_pro': '升级专业版',
    'nav.profile': '个人中心',

    // Landing
    'landing.status': '系统状态: V2.0 稳定运行中',
    'landing.hero_title_1': '机构级 Alpha，',
    'landing.hero_title_2': '由 AI 普及大众。',
    'landing.hero_desc': '首个由大语言模型驱动的量化生态系统。通过自然语言生成机构级 Python 策略，或一键镜像全网顶尖投资组合。',
    'landing.btn_start': '免费构建策略',
    'landing.btn_docs': '查看 API 文档',
    'landing.btn_launch': '启动终端',
    'landing.nav_platform': '平台',
    'landing.nav_engine': 'AI 引擎',
    'landing.nav_bridge': '全网跟单',
    'landing.nav_data': '数据中心',
    'landing.core_engines': '双核引擎',
    'landing.core_desc': '创新双引擎驱动：AI 生产与全网复制。',
    'landing.feat_gen_title': '生成式代码引擎',
    'landing.feat_gen_desc': '用自然语言描述逻辑。微调大模型即刻生成无语法错误的生产级 Python (Backtrader/QMT) 代码。',
    'landing.feat_bridge_title': '全网跟单引擎',
    'landing.feat_bridge_desc': '打破生态孤岛。粘贴雪球、聚宽或同花顺的组合 URL，实现毫秒级实盘信号同步。',
    'landing.feat_risk_title': '机构级风控系统',
    'landing.feat_risk_desc': '内置 PIT (Point-in-Time) 数据清洗、滑点保护与自动再平衡。资金入场前，风控先行。',
    'landing.data_title': '全栈数据中心',
    'landing.data_desc': '访问经过清洗的全球市场历史数据与实时流。',
    'landing.data_btn': '探索数据中心',
    'landing.footer_rights': '© 2024 Quant AI Inc. 机构版',
    'landing.login': '登录',
    'landing.signup': '注册',
    'landing.demo_url_ph': '粘贴 URL (如: 雪球/聚宽组合)',
    'landing.demo_parse': '解析策略',
    'landing.demo_analyzing': '分析中...',
    'landing.demo_acquired': '信号已捕获',
    'landing.demo_result_return': '累计收益',
    'landing.demo_cta_login': '登录以开始跟单',

    // Auth
    'auth.login_title': '欢迎回来',
    'auth.login_desc': '登录以访问您的量化控制台',
    'auth.register_title': '创建账户',
    'auth.register_desc': '开启您的机构级量化之旅',
    'auth.email': '电子邮箱',
    'auth.phone': '手机号码',
    'auth.password': '密码',
    'auth.confirm_password': '确认密码',
    'auth.fullname': '真实姓名',
    'auth.remember': '记住我',
    'auth.forgot': '忘记密码？',
    'auth.signin': '登录',
    'auth.signup': '立即注册',
    'auth.have_account': '已有账户？',
    'auth.no_account': "还没有账户？",
    'auth.terms': '我同意服务条款和隐私政策',
    'auth.or_continue': '或通过以下方式继续',
    'auth.tab_pwd': '密码登录',
    'auth.tab_sms': '验证码登录',
    'auth.tab_wechat': '微信扫码',
    'auth.captcha': '图形验证码',
    'auth.sms_code': '短信验证码',
    'auth.get_code': '获取验证码',
    'auth.resend': '重发',
    'auth.scan_wechat': '使用微信扫一扫登录',
    'auth.bind_wechat_title': '绑定微信',
    'auth.bind_wechat_desc': '绑定微信账号，即可享受微信扫码登录及实时交易成交推送通知。',
    'auth.skip': '暂不绑定',
    'auth.bind': '立即绑定',

    // Dashboard
    'dash.hero_title': '以自然语言，构建',
    'dash.hero_title_highlight': '机构级 Alpha',
    'dash.hero_desc': '消除技术壁垒。使用自然语言构建稳健的交易策略，或即刻镜像外部平台的顶尖投资组合。',
    'dash.btn_generate': '立即生成策略',
    'dash.btn_copy': '开启一键跟单',
    'dash.stat_vol': '平台总交易额',
    'dash.stat_vol_sub': '全平台实时成交量',
    'dash.stat_active': '运行中策略',
    'dash.stat_active_sub': '跨 QMT & Ptrade 终端',
    'dash.stat_apy': '今日最高收益',
    'dash.stat_apy_sub': "策略: 'Alpha-Dragon-V2'",
    'dash.market_sentiment': '市场情绪',
    'dash.recent_signals': '社区最新信号',

    // Workshop
    'work.title': 'AI 助手',
    'work.model_select': '模型',
    'work.empty_state': '描述您的策略思路。',
    'work.empty_hint': '例如："当 RSI 低于 30 时买入苹果，高于 70 时卖出"',
    'work.input_placeholder': '输入策略逻辑...',
    'work.code_title': 'Python 策略代码',
    'work.btn_format': '格式化',
    'work.code_placeholder': '# AI 生成的代码将显示在这里...',
    'work.backtest_title': '回测配置',
    'work.ready_test': '准备就绪',
    'work.sharpe': '夏普比率',
    'work.max_dd': '最大回撤',
    'work.btn_run': '运行回测',
    'work.btn_running': '模拟运算中...',
    'work.date_start': '开始日期',
    'work.date_end': '结束日期',

    // Signal Bridge
    'bridge.title': '全网跟单引擎',
    'bridge.desc': '连接外部组合 URL，实现自动化信号复制。',
    'bridge.input_placeholder': '粘贴链接 (如: https://xueqiu.com/P/ZH123456)',
    'bridge.btn_connect': '连接',
    'bridge.btn_analyzing': '解析中...',
    'bridge.btn_connected': '已连接',
    'bridge.status_waiting': '等待信号源接入...',
    'bridge.status_crawling': '正在爬取组合数据...',
    'bridge.risk_title': '风控管理',
    'bridge.risk_multiplier': '跟单倍率',
    'bridge.risk_reverse': '反向跟单 (做空)',
    'bridge.risk_slippage': '滑点保护已启用。偏离度 > 2% 的订单将被拒绝。',
    'bridge.stream_title': '实时信号流',

    // My Strategies
    'mystrat.title': '我的策略',
    'mystrat.tab_self': '自研策略',
    'mystrat.tab_copy': '跟单策略',
    'mystrat.assets': '总资产',
    'mystrat.day_pnl': '今日盈亏',
    'mystrat.active_count': '运行中策略',
    'mystrat.edit_modal': '策略详情',
    'mystrat.btn_save': '保存修改',
    'mystrat.btn_pause': '暂停策略',
    'mystrat.btn_start': '启动策略',
    'mystrat.roi': '累计收益率',
    'mystrat.maxdd': '最大回撤',
    'mystrat.win_rate': '胜率',
    'mystrat.code_preview': '代码预览',
    'mystrat.strat_name': '策略名称',
    'mystrat.strat_desc': '描述',

    // Data Center
    'data.title': '数据中心',
    'data.tab_all': '全部数据',
    'data.tab_stock': '股票',
    'data.tab_crypto': '数字货币',
    'data.tab_macro': '宏观经济',
    'data.tab_deriv': '衍生品',
    'data.sample': '数据样例',
    'data.api': 'API 接入',
    'data.btn_copy_token': '复制 Token',
    'data.status_active': '可用',
    'data.status_subscribe': '需订阅',
    'data.price_free': '免费',
    'data.price_pro': '专业版',
    'data.btn_download': '下载 CSV',

    // Community
    'comm.title': '策略社区',
    'comm.tab_feed': '最新动态',
    'comm.tab_market': '策略集市',
    'comm.btn_post': '发布帖子',
    'comm.reply': '回复',
    'comm.comments': '评论',
    'comm.post_create_title': '发布新帖子',
    'comm.post_title_ph': '输入帖子标题...',
    'comm.post_content_ph': '分享你的策略心得或市场观点...',
    'comm.btn_publish': '立即发布',
    'comm.back': '返回列表',
    'comm.official': '官方',
    'comm.subscribe': '订阅',
    'comm.total_return': '总回报率',

    // Profile
    'profile.title': '账户设置',
    'profile.plan': '当前套餐',
    'profile.api_key': 'AI 模型配置',
    'profile.api_desc': '配置不同厂商的 API Key 以驱动 AI 策略工坊。',
    'profile.notifications': '通知设置',
    'profile.wechat_status': '微信绑定',
    'profile.btn_regenerate': '更新密钥',
    'profile.btn_bind': '绑定微信',
    'profile.btn_upgrade': '升级套餐',
    'profile.provider': '模型厂商',
    'profile.key_ph': '输入 API Key (sk-...)',
    'profile.save_key': '保存配置',
    'profile.email_alerts': '邮件警报',
    'profile.email_desc': '接收每日摘要和风控警报',
    'profile.bound': '已绑定',
    'profile.not_bound': '未绑定',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const browserLang = navigator.language;
    if (browserLang.startsWith('zh')) {
      setLanguage('zh');
    } else {
      setLanguage('en');
    }
  }, []);

  const t = (key: string): string => {
    // @ts-ignore
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

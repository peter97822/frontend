import { Icon, IconProps } from "@chakra-ui/react";

export function LogoWithTextIcon(props: IconProps) {
  return (
    <Icon viewBox="0 0 644 222" width="2.9em" height="1em" {...props}>
      <g fill="currentColor">
        <path d="M509.84 32.4442C507.189 31.3372 504.025 30.7837 500.349 30.7837C498.638 30.7837 496.885 30.9114 495.09 31.1669C493.38 31.4223 491.669 31.7204 489.959 32.061L497.783 0L477.902 3.06559L454.815 99.1208H473.926L486.368 47.2612C487.565 47.0058 488.762 46.7929 489.959 46.6226C491.242 46.4522 492.567 46.3671 493.935 46.3671C497.185 46.3671 499.365 47.1761 500.477 48.794C501.674 50.3268 502.273 52.2002 502.273 54.4143C502.273 55.8619 502.102 57.3947 501.759 59.0127C501.503 60.6306 501.204 62.1634 500.862 63.611L492.396 99.1208H511.508L520.23 62.8447C521.085 59.3533 521.512 55.8193 521.512 52.2428C521.512 49.1772 521.085 46.3245 520.23 43.6847C519.374 41.0449 518.092 38.7883 516.382 36.9148C514.671 34.9563 512.491 33.4661 509.84 32.4442Z" />
        <path d="M249.217 20.0541C249.388 23.5455 249.602 27.5052 249.859 31.9333C250.201 36.3613 250.543 40.9597 250.885 45.7284L252.167 59.7791C252.595 64.4626 253.023 68.8055 253.45 72.8078C255.673 68.4649 257.939 63.7814 260.248 58.7572C262.557 53.733 264.866 48.5386 267.174 43.1738C269.483 37.809 271.749 32.359 273.972 26.8239C276.281 21.2888 278.462 15.8815 280.514 10.6018H301.677C295.008 26.7814 288.21 42.1945 281.283 56.8412C274.357 71.4028 266.918 85.496 258.965 99.1208H240.239C239.555 94.4373 238.914 89.9666 238.315 85.7089C237.802 81.3659 237.289 77.1082 236.776 72.9356C236.348 68.7629 235.921 64.5478 235.493 60.29C235.151 56.0322 234.809 51.6041 234.467 47.0058C229.593 56.0322 224.762 64.8884 219.973 73.5742C215.27 82.1749 210.225 90.6905 204.838 99.1208H186.111C185.427 91.2014 184.914 83.3671 184.572 75.618C184.316 67.8688 184.188 59.9919 184.188 51.9873C184.188 45.0898 184.316 38.2348 184.572 31.4223C184.829 24.5247 185.171 17.5846 185.598 10.6018H205.736C205.308 18.0955 204.881 25.4615 204.453 32.6997C204.111 39.8527 203.94 47.3038 203.94 55.0529V63.8665C203.94 66.847 204.026 69.8274 204.197 72.8078C206.591 68.6352 209.113 64.2071 211.764 59.5236C214.415 54.84 217.023 50.1565 219.588 45.473C222.154 40.7894 224.591 36.2762 226.899 31.9333C229.208 27.5052 231.175 23.5455 232.8 20.0541H249.217Z" />
        <path fillRule="evenodd" clipRule="evenodd" d="M345.614 70.1254C344.417 74.9793 344.075 79.8757 344.588 84.8147C345.101 89.6686 346.084 94.0115 347.538 97.8435L330.479 100.27C329.966 99.2486 329.495 98.2693 329.068 97.3326C328.64 96.3959 328.213 95.3314 327.785 94.1393C325.391 96.0978 322.74 97.7158 319.833 98.9931C316.926 100.27 313.676 100.909 310.085 100.909C305.809 100.909 302.132 100.185 299.054 98.7376C296.061 97.2048 293.581 95.2037 291.615 92.7342C289.734 90.1795 288.365 87.2417 287.51 83.9206C286.655 80.5144 286.228 76.8953 286.228 73.0633C286.228 67.1876 287.254 61.6525 289.306 56.458C291.444 51.2635 294.351 46.7503 298.028 42.9183C301.79 39.0011 306.194 35.9356 311.239 33.7215C316.284 31.5075 321.757 30.4005 327.657 30.4005C328.427 30.4005 329.752 30.443 331.633 30.5282C333.6 30.6134 335.823 30.8262 338.303 31.1669C340.783 31.4223 343.391 31.8907 346.127 32.5719C348.863 33.2532 351.471 34.1899 353.951 35.382L345.614 70.1254ZM332.274 46.6226C331.163 46.4522 330.137 46.3245 329.196 46.2394C328.341 46.1542 327.272 46.1116 325.99 46.1116C323.082 46.1116 320.346 46.8354 317.781 48.2831C315.301 49.7307 313.12 51.6467 311.239 54.0311C309.358 56.3303 307.862 59.0127 306.75 62.0783C305.724 65.1438 305.211 68.3372 305.211 71.6582C305.211 75.7457 305.895 78.9816 307.263 81.3659C308.631 83.7503 311.154 84.9425 314.831 84.9425C316.797 84.9425 318.55 84.5593 320.089 83.7929C321.714 83.0265 323.424 81.7491 325.22 79.9609C325.391 77.832 325.647 75.618 325.99 73.3188C326.417 70.9344 326.845 68.7629 327.272 66.8044L332.274 46.6226Z" />
        <path d="M388.312 12.1346L368.431 15.2002L355.861 68.0817C354.835 72.4246 354.236 76.5547 354.065 80.4718C353.894 84.389 354.493 87.8803 355.861 90.9459C357.229 93.9264 359.538 96.3107 362.787 98.099C366.037 99.8021 370.611 100.654 376.512 100.654C380.616 100.654 384.165 100.313 387.157 99.6318C390.15 98.9505 392.929 98.1415 395.495 97.2048L394.084 82.6433C392.117 83.3245 390.15 83.878 388.184 84.3038C386.302 84.6444 384.336 84.8147 382.283 84.8147C379.889 84.8147 378.008 84.4741 376.64 83.7929C375.272 83.1116 374.288 82.1749 373.69 80.9827C373.177 79.7054 372.963 78.2152 373.048 76.5121C373.219 74.809 373.561 72.9781 374.075 71.0196L379.718 47.5167H400.882L404.73 31.9333H383.438L388.312 12.1346Z" />
        <path d="M406.271 55.9471C408.152 50.8377 410.846 46.3671 414.351 42.5351C417.857 38.7031 422.09 35.6801 427.05 33.4661C432.095 31.252 437.696 30.145 443.852 30.145C447.7 30.145 451.121 30.5282 454.113 31.2946C457.192 31.9758 459.971 32.9125 462.451 34.1047L455.909 48.9217C454.199 48.2405 452.403 47.6444 450.522 47.1335C448.726 46.5374 446.503 46.2394 443.852 46.2394C437.439 46.2394 432.394 48.4108 428.717 52.7537C425.04 57.0115 423.202 62.8447 423.202 70.2532C423.202 74.5961 424.142 78.13 426.024 80.855C427.905 83.4948 431.368 84.8147 436.413 84.8147C438.893 84.8147 441.287 84.5593 443.596 84.0483C445.904 83.5374 447.957 82.8987 449.752 82.1323L451.163 97.3326C448.769 98.2693 446.118 99.0783 443.211 99.7595C440.389 100.526 436.926 100.909 432.822 100.909C427.52 100.909 423.031 100.143 419.354 98.6099C415.677 97.0771 412.641 95.0334 410.247 92.4787C407.853 89.8389 406.1 86.7733 404.988 83.2819C403.962 79.7906 403.449 76.1289 403.449 72.2969C403.449 66.5063 404.39 61.0564 406.271 55.9471Z" />
        <path d="M274.88 151.579C272.229 150.44 269.064 149.871 265.385 149.871C263.675 149.871 261.921 150.002 260.125 150.265C258.414 150.528 256.703 150.834 254.992 151.185L262.819 118.208L242.931 121.361L219.835 220.161H238.954L251.4 166.819C252.597 166.557 253.795 166.338 254.992 166.162C256.275 165.987 257.601 165.9 258.97 165.9C262.221 165.9 264.402 166.732 265.514 168.396C266.711 169.972 267.31 171.899 267.31 174.177C267.31 175.666 267.139 177.242 266.797 178.906C266.54 180.571 266.241 182.147 265.899 183.636L257.43 220.161H276.548L285.274 182.848C286.129 179.257 286.557 175.622 286.557 171.943C286.557 168.79 286.129 165.856 285.274 163.141C284.418 160.425 283.135 158.104 281.424 156.177C279.713 154.163 277.532 152.63 274.88 151.579Z" />
        <path d="M209.825 130.689L189.937 133.842L177.363 188.235C176.336 192.702 175.738 196.95 175.567 200.979C175.396 205.008 175.994 208.599 177.363 211.752C178.732 214.818 181.041 217.27 184.292 219.11C187.542 220.861 192.119 221.737 198.021 221.737C202.127 221.737 205.677 221.387 208.671 220.686C211.664 219.985 214.444 219.153 217.011 218.19L215.599 203.212C213.632 203.913 211.664 204.482 209.697 204.92C207.815 205.271 205.848 205.446 203.795 205.446C201.4 205.446 199.518 205.095 198.149 204.395C196.78 203.694 195.797 202.731 195.198 201.504C194.685 200.19 194.471 198.658 194.556 196.906C194.728 195.154 195.07 193.271 195.583 191.256L201.229 167.082H222.4L226.249 151.053H204.95L209.825 130.689Z" />
        <path fillRule="evenodd" clipRule="evenodd" d="M289.819 193.096C289.819 187.49 290.76 182.06 292.642 176.804C294.61 171.549 297.347 166.907 300.854 162.878C304.361 158.761 308.595 155.477 313.557 153.024C318.604 150.484 324.164 149.214 330.237 149.214C333.231 149.214 336.011 149.652 338.577 150.528C341.143 151.404 343.367 152.674 345.249 154.338C347.217 156.002 348.714 158.06 349.74 160.513C350.852 162.878 351.408 165.593 351.408 168.659C351.408 173.564 350.339 177.724 348.2 181.14C346.062 184.556 343.068 187.359 339.219 189.548C335.455 191.651 330.964 193.183 325.746 194.147C320.528 195.11 314.84 195.592 308.681 195.592C309.28 199.271 310.563 201.898 312.53 203.475C314.583 204.964 317.791 205.709 322.154 205.709C324.891 205.709 327.671 205.49 330.494 205.052C333.317 204.526 335.968 203.782 338.449 202.818L339.86 218.19C337.465 219.153 334.386 220.029 330.622 220.818C326.944 221.606 322.923 222 318.561 222C313.257 222 308.767 221.255 305.088 219.766C301.496 218.19 298.545 216.088 296.235 213.46C294.011 210.832 292.386 207.767 291.359 204.263C290.333 200.76 289.819 197.037 289.819 193.096ZM327.158 164.717C322.795 164.717 318.946 166.338 315.61 169.578C312.359 172.732 310.221 176.936 309.194 182.191C314.498 182.016 318.775 181.578 322.025 180.877C325.276 180.089 327.799 179.169 329.596 178.118C331.392 177.067 332.589 175.928 333.188 174.702C333.787 173.476 334.086 172.25 334.086 171.024C334.086 166.819 331.777 164.717 327.158 164.717Z" />
        <path fillRule="evenodd" clipRule="evenodd" d="M412.145 221.612C406.979 221.612 401.685 221.396 396.26 220.965C390.836 220.533 385.929 219.843 381.538 218.894L402.201 132.199C407.109 131.25 412.231 130.603 417.569 130.258C422.993 129.913 427.944 129.74 432.421 129.74C437.587 129.74 442.021 130.301 445.723 131.422C449.511 132.458 452.567 133.881 454.892 135.692C457.303 137.504 459.068 139.661 460.187 142.162C461.392 144.578 461.995 147.166 461.995 149.926C461.995 151.824 461.78 153.808 461.349 155.878C461.005 157.949 460.23 160.019 459.024 162.089C457.905 164.073 456.312 165.971 454.246 167.783C452.266 169.594 449.64 171.233 446.368 172.7C450.243 174.425 453.084 176.797 454.892 179.817C456.7 182.75 457.604 186.028 457.604 189.651C457.604 193.792 456.786 197.803 455.15 201.685C453.514 205.48 450.888 208.888 447.272 211.907C443.656 214.84 438.964 217.212 433.196 219.024C427.427 220.749 420.41 221.612 412.145 221.612ZM410.337 181.24L404.784 204.531C406.162 204.79 407.883 205.006 409.95 205.178C412.102 205.265 414.082 205.308 415.89 205.308C418.473 205.308 421.013 205.135 423.51 204.79C426.093 204.359 428.374 203.626 430.355 202.59C432.421 201.555 434.1 200.132 435.391 198.32C436.683 196.509 437.328 194.18 437.328 191.333C437.328 190.125 437.07 188.918 436.553 187.71C436.123 186.502 435.391 185.424 434.358 184.475C433.325 183.526 431.947 182.75 430.225 182.146C428.59 181.542 426.609 181.24 424.285 181.24H410.337ZM414.082 166.101H426.738C431.904 166.101 435.736 164.979 438.232 162.736C440.815 160.493 442.107 157.819 442.107 154.714C442.107 153.075 441.719 151.695 440.944 150.573C440.256 149.365 439.309 148.416 438.103 147.726C436.898 147.036 435.52 146.562 433.971 146.303C432.421 145.958 430.828 145.785 429.192 145.785C427.384 145.785 425.447 145.872 423.381 146.044C421.314 146.13 419.765 146.26 418.732 146.432L414.082 166.101Z" />
        <path d="M529.305 152.385L520.136 191.074C518.93 195.991 518.586 200.951 519.103 205.955C519.619 210.872 520.609 215.271 522.073 219.153L504.897 221.612C503.95 219.714 503.046 217.6 502.185 215.271C499.774 217.169 497.062 218.765 494.049 220.059C491.035 221.353 487.678 222 483.975 222C478.896 222 474.763 221.094 471.578 219.283C468.478 217.385 466.154 214.926 464.604 211.907C463.054 208.802 462.193 205.265 462.021 201.297C461.935 197.328 462.408 193.274 463.442 189.133L472.223 152.385H491.466L482.813 188.874C482.383 190.772 481.995 192.713 481.651 194.697C481.393 196.681 481.393 198.536 481.651 200.261C481.909 201.9 482.555 203.281 483.588 204.402C484.707 205.437 486.429 205.955 488.754 205.955C490.734 205.955 492.542 205.61 494.178 204.92C495.9 204.143 497.708 202.849 499.602 201.038C499.774 198.881 500.032 196.638 500.377 194.309C500.807 191.894 501.238 189.694 501.668 187.71L510.063 152.385H529.305Z" />
        <path d="M574.771 167.783C576.493 168.128 578.215 168.516 579.937 168.947L585.619 153.42C583.639 152.557 581.314 151.953 578.645 151.608C576.062 151.177 573.695 150.961 571.542 150.961C565.774 150.961 560.565 151.522 555.916 152.643C551.353 153.679 547.22 154.8 543.518 156.008L528.021 220.447H547.263L559.79 168.171C560.737 167.912 561.942 167.697 563.406 167.524C564.87 167.265 566.204 167.136 567.41 167.136C570.681 167.136 573.135 167.352 574.771 167.783Z" />
        <path d="M592.177 155.49C593.641 155.059 595.233 154.584 596.955 154.067C598.763 153.463 600.743 152.945 602.896 152.514C605.134 151.996 607.588 151.608 610.257 151.349C613.012 151.004 616.112 150.832 619.555 150.832C629.715 150.832 636.689 153.765 640.477 159.631C644.265 165.497 644.911 173.519 642.414 183.699L633.632 220.447H614.39L622.913 184.475C623.43 182.232 623.817 180.076 624.076 178.005C624.42 175.849 624.42 173.994 624.076 172.441C623.731 170.802 622.913 169.508 621.622 168.559C620.416 167.524 618.522 167.006 615.939 167.006C613.443 167.006 610.903 167.265 608.32 167.783L595.793 220.447H576.551L592.177 155.49Z" />
      </g>
      <circle cx="74.0981" cy="151" r="71" fill="url(#paint0_linear)" />
      <path d="M124.303 0L23.8936 100.585C-3.83366 128.36 -3.83366 173.393 23.8936 201.168L124.303 100.584C152.03 72.8084 152.03 27.7754 124.303 0Z" fill="url(#paint1_linear)" />
      <defs>
        <linearGradient id="paint0_linear" x1="132.233" y1="92.213" x2="25.1468" y2="201.54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FAB951" />
          <stop offset="1" stopColor="#FF5F52" />
        </linearGradient>
        <linearGradient id="paint1_linear" x1="74.0981" y1="0" x2="74.0981" y2="201.168" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C62828" />
          <stop offset="1" stopColor="#FF5F52" />
        </linearGradient>
      </defs>

    </Icon>
  )
}

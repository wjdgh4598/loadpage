package com.test.loadpage.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class HomeController {

    @GetMapping("/")
    public ModelAndView view(HttpServletRequest request, ModelAndView modelAndView) {
        // page를 넘겨받을 loadpage
        String loadpage = request.getParameter("loadpage");

        loadpage = loadpage != null ? loadpage : "/main/main/view";

        modelAndView.addObject("roleIds", "20");
        modelAndView.addObject("loadpage", loadpage);
        modelAndView.addObject("mainYn", true);

        modelAndView.setViewName("layout/mainlayout");

        return modelAndView;
    }


    /**
     * view
     *
     * @param modelAndView
     * @return
     */
    @Order(0)
    @GetMapping("/{depth1}/{depth2}/view")
    public ModelAndView view(@PathVariable("depth1") String depth1, @PathVariable("depth2") String depth2, HttpServletRequest request, ModelAndView modelAndView) {
        String mdiparam = request.getParameter("mdiparam");

        modelAndView.addObject("mainYn", false);
        modelAndView.addObject("mdiparam", mdiparam); // 1번 Tab MDI 에서 2번 Tab MDI 호출시 Parameter 넘길경우에 사용

        modelAndView.setViewName(depth1+"/"+depth2);
        return modelAndView;
    }

    /**
     * view
     *
     * @param modelAndView
     * @return
     * @throws JsonProcessingException
     * @throws JsonMappingException
     */
    @Order(0)
    @GetMapping("/{depth1}/{depth2}/{depth3}/view")
    public ModelAndView view(@PathVariable("depth1") String depth1, @PathVariable("depth2") String depth2, @PathVariable("depth3") String depth3, HttpServletRequest request, ModelAndView modelAndView) throws JsonMappingException, JsonProcessingException {
        String mdiparam = request.getParameter("mdiparam");
        String params = request.getParameter("params");		//공통(각자 필요한 값 담아 사용하세요)

        modelAndView.addObject("mainYn", false);
        modelAndView.addObject("mdiparam", mdiparam); // 1번 Tab MDI 에서 2번 Tab MDI 호출시 Parameter 넘길경우에 사용
        modelAndView.addObject("params", params);

        modelAndView.setViewName(depth1+"/"+depth2+"/"+depth3);
        return modelAndView;
    }
    /**
     * view
     *
     * @param modelAndView
     * @return
     */
    @Order(0)
    @GetMapping("/{depth1}/{depth2}/{depth3}/view3")
    public ModelAndView view3(@PathVariable("depth1") String depth1, @PathVariable("depth2") String depth2, @PathVariable("depth3") String depth3, HttpServletRequest request, ModelAndView modelAndView) {
        String mdiparam = request.getParameter("mdiparam");
        modelAndView.addObject("mainYn", false);
        modelAndView.addObject("mdiparam", mdiparam); // 1번 Tab MDI 에서 2번 Tab MDI 호출시 Parameter 넘길경우에 사용

        modelAndView.setViewName("sfip/"+depth1+"/"+depth2+"/"+depth3);
        return modelAndView;
    }
}
